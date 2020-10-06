import { html, customElement, TemplateResult } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import app from 'app';
import { ls, formatLS } from 'ls';
import { EntityType } from 'lib/entity';
import { splitLocalizedString } from 'lib/stringUtils';
import LoadingStatus from 'lib/loadingStatus';
import { listenForVisibilityChange } from 'lib/htmlLib';
import CmtCollector from './cmtCollector';
import Cmt, { CmtCountChangedEventDetail } from './cmt';
import './cmtView';
import './replyListView';
import './cmtFooterView';
import { SetCmtResponse } from './loaders/setCmtLoader';

@customElement('cmt-list-view')
export class CmtListView extends BaseElement {
  @lp.string hostID = '';
  @lp.number hostType: EntityType = 0;
  // The number of all top-level comments and their replies.
  @lp.number totalCount = 0;
  // Starts loading comment when the component is first visible.
  @lp.bool loadOnVisible = false;

  // Can only be changed within `CmtCollector.itemsChanged` event.
  // `CmtCollector` provides paging and duplication removal.
  // DO NOT modify `items` elsewhere.
  @lp.array private items: Cmt[] = [];
  @lp.bool hasNext = false;
  @lp.number page = 1;

  private cmtCollector: CmtCollector | null = null;
  @lp.object collectorLoadingStatus = LoadingStatus.empty;

  firstUpdated() {
    this.cmtCollector = new CmtCollector(
      {
        hostID: this.hostID,
        hostType: this.hostType,
        page: this.page,
      },
      undefined,
      (status) => {
        this.collectorLoadingStatus = status;
      },
      (e) => {
        this.items = e.items;
        this.hasNext = e.hasNext;
        this.page = e.page;
      },
    );

    if (this.loadOnVisible) {
      listenForVisibilityChange([this], () => this.loadMore);
    } else {
      this.loadMore();
    }
  }

  render() {
    const { totalCount, collectorLoadingStatus } = this;
    let titleGroup = html` <h2>${ls.comments}</h2> `;
    let contentGroup = html``;

    if (!totalCount && (collectorLoadingStatus.isSuccess || collectorLoadingStatus.isEmpty)) {
      titleGroup = html`
        ${titleGroup}
        <p>${ls.noComment}</p>
      `;
    } else {
      const childViews: TemplateResult[] = [];
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        childViews.push(
          html`
            <reply-list-view
              .cmt=${item}
              .hostID=${this.hostID}
              .hostType=${this.hostType}
              @replyCountChanged=${this.handleReplyCountChanged}
              @rootCmtDeleted=${(e: CustomEvent<CmtCountChangedEventDetail>) =>
                this.handleRootCmtDeleted(i, e.detail)}
            ></reply-list-view>
          `,
        );
      }
      contentGroup = html`
        <div>
          <div>${childViews}</div>
          ${this.totalCount
            ? html`
                <div>
                  <small class="is-secondary">${formatLS(ls.pNOComments, this.totalCount)}</small>
                </div>
              `
            : html``}
          <cmt-footer-view
            .status=${this.collectorLoadingStatus}
            .hasNext=${this.hasNext}
            .loadedCount=${this.items.length}
            @viewMoreClick=${this.handleViewMoreClick}
          ></cmt-footer-view>
        </div>
      `;
    }

    const addCmtGroup = app.state.hasUser
      ? this.renderCommentComposer()
      : this.renderLoginToComment();

    return html` ${titleGroup}${addCmtGroup}${contentGroup} `;
  }

  private async handleViewMoreClick() {
    await this.loadMore();
  }

  private async loadMore() {
    await this.cmtCollector?.loadMoreAsync();
  }

  private handleReplyCountChanged(e: CustomEvent<CmtCountChangedEventDetail>) {
    this.onTotalCountChanged(e.detail.offset);
  }

  private renderLoginToComment() {
    const loginToCommentTextArray = splitLocalizedString(ls.plsLoginToComment);
    return html`
      <div>
        <span>${loginToCommentTextArray[0]}</span>
        <qing-button btnStyle="success" class="m-l-xs m-r-xs"
          >${loginToCommentTextArray[1]}</qing-button
        >
        <span>${loginToCommentTextArray[2]}</span>
      </div>
    `;
  }

  private renderCommentComposer() {
    return html`
      <add-cmt-app
        .hostID=${this.hostID}
        .hostType=${this.hostType}
        @cmtAdded=${this.handleCmtAdded}
      ></add-cmt-app>
    `;
  }

  private async handleCmtAdded(e: CustomEvent<SetCmtResponse>) {
    this.cmtCollector?.prepend([e.detail.cmt]);
  }

  private handleRootCmtDeleted(index: number, detail: CmtCountChangedEventDetail) {
    this.cmtCollector?.deleteByIndex(index);
    // Total number of comments is down by 1 (this comment) plus all its replies.
    // `detail.count` can be undefined if the comment doesn't contain any replies.
    this.onTotalCountChanged(-(detail.count || 0) - 1);
  }

  private onTotalCountChanged(offset: number) {
    this.dispatchEvent(
      new CustomEvent<number>('totalCountChangedWithOffset', {
        detail: offset,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-list-view': CmtListView;
  }
}
