import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import app from 'app';
import { ls, formatLS } from 'ls';
import { splitLocalizedString } from 'lib/stringUtils';
import LoadingStatus from 'lib/loadingStatus';
import { listenForVisibilityChange } from 'lib/htmlLib';
import Cmt, { CmtCountChangedEventDetail } from '../data/cmt';
import './cmtView';
import './cmtBlock';
import './cmtFooterView';
import { CHECK } from 'checks';
// eslint-disable-next-line import/no-extraneous-dependencies
import { repeat } from 'lit-html/directives/repeat';
import { CmtDataHub } from '../data/cmtDataHub';

@customElement('root-cmt-list')
// Displays a list of <cmt-block>.
export class RootCmtList extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  // The number of all comments and their replies.
  @lp.number totalCmtCount = 0;

  // Starts loading comment when the component is first visible.
  @lp.bool loadOnVisible = false;

  // Can only be changed within `CmtCollector.itemsChanged` event.
  // `CmtCollector` provides paging and duplication removal.
  // DO NOT modify `items` elsewhere.
  @lp.array private items: readonly Cmt[] = [];
  @lp.bool hasNext = false;

  @lp.object collectorLoadingStatus = LoadingStatus.notStarted;
  @lp.object hub!: CmtDataHub;

  firstUpdated() {
    CHECK(this.hub);

    const { hub } = this;
    hub.onRootLoadingStatusChanged((status) => {
      this.collectorLoadingStatus = status;
    });
    hub.onRootItemsChanged((e) => {
      this.items = e.items;
      this.hasNext = e.hasNext;
    });

    if (this.loadOnVisible) {
      listenForVisibilityChange([this], () => this.loadMore());
    } else {
      this.loadMore();
    }
  }

  render() {
    const { totalCmtCount, collectorLoadingStatus } = this;
    let titleGroup = html` <h2>${ls.comments}</h2> `;
    let contentGroup = html``;

    if (!totalCmtCount && (collectorLoadingStatus.isSuccess || !collectorLoadingStatus.isStarted)) {
      titleGroup = html`
        ${titleGroup}
        <p>${ls.noComments}</p>
      `;
    } else {
      const childViews = repeat(
        this.items,
        (it) => it.id,
        (it, i) => html`
          <cmt-block
            .cmt=${it}
            @replyCountChanged=${this.handleReplyCountChanged}
            @rootCmtDeleted=${(e: CustomEvent<CmtCountChangedEventDetail>) =>
              this.handleRootCmtDeleted(i, e.detail)}
          ></cmt-block>
        `,
      );
      contentGroup = html`
        <div>
          <div>${childViews}</div>
          ${this.totalCmtCount
            ? html`
                <div>
                  <small class="is-secondary"
                    >${formatLS(ls.pNOComments, this.totalCmtCount)}</small
                  >
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
    await this.hub.loadMoreAsync();
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
      <p>
        <qing-button btnStyle="success" @click=${this.handleAddCommentButtonClick}
          >${ls.writeAComment}</qing-button
        >
      </p>
    `;
  }

  private handleRootCmtDeleted(index: number, detail: CmtCountChangedEventDetail) {
    this.cmtCollector?.deleteByIndex(index);
    // Total number of comments is down by 1 (this comment) plus all its replies.
    // `detail.count` can be undefined if the comment doesn't contain any replies.
    this.onTotalCountChanged(-(detail.count || 0) - 1);
  }

  private handleAddCommentButtonClick() {
    this.hub.requestOpenEditor({});
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
    'root-cmt-list': RootCmtList;
  }
}
