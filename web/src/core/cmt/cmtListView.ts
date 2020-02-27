import { html, customElement, TemplateResult } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import app from 'app';
import Cmt from './cmt';
import './cmtView';
import ls from 'ls';
import CmtCollector from './cmtCollector';
import './replyListView';
import './cmtFooterView';
import { EntityType } from 'lib/entity';
import { splitLocalizedString } from 'lib/stringUtils';
import { SetCmtResponse } from './loaders/setCmtLoader';
import LoadingStatus from 'lib/loadingStatus';

@customElement('cmt-list-view')
export class CmtListView extends BaseElement {
  @lp.string hostID = '';
  @lp.number hostType: EntityType = 0;
  @lp.number initialTotalCount = 0;

  // The number of all top-level comments and their replies.
  @lp.number private totalCount = 0;

  // Members of `ItemsChangedEventArgs`:
  @lp.array private items: Cmt[] = [];
  @lp.bool hasNext = false;
  @lp.number page = 1;
  @lp.number count = 0;
  @lp.number actualCount = 0;

  private cmtCollector: CmtCollector | null = null;
  @lp.object collectorLoadingStatus = LoadingStatus.empty;

  async firstUpdated() {
    this.totalCount = this.initialTotalCount;
    this.cmtCollector = new CmtCollector(
      this.hostID,
      this.hostType,
      status => {
        this.collectorLoadingStatus = status;
      },
      itemsChangedArgs => {
        Object.assign(this, itemsChangedArgs);

        if (itemsChangedArgs.count) {
          const delta = itemsChangedArgs.count - this.count;
          if (delta) {
            // Propagate changes of count.
            this.dispatchEvent(
              new CustomEvent<number>('cmtsCountChanged', { detail: delta }),
            );
          }
        }
      },
    );

    if (this.totalCount) {
      await this.cmtCollector?.loadMoreAsync();
    }
  }

  render() {
    const { totalCount, collectorLoadingStatus } = this;
    let titleGroup = html`
      <h2>${ls.comments}</h2>
    `;
    let contentGroup = html``;

    if (
      !totalCount &&
      (collectorLoadingStatus.isSuccess || collectorLoadingStatus.isEmpty)
    ) {
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
              @repliesCountChanged=${this.handleReplyCountChanged}
              @rootCmtDeleted=${() => this.handleCmtDeleted(i)}
            ></reply-list-view>
          `,
        );
      }
      contentGroup = html`
        <div>
          <div>
            ${childViews}
          </div>
          <cmt-footer-view
            .status=${this.collectorLoadingStatus}
            .hasNext=${this.hasNext}
            @viewMoreClick=${this.handleViewMoreClick}
          ></cmt-footer-view>
        </div>
      `;
    }

    const addCmtGroup = app.state.hasUser
      ? this.renderCommentComposer()
      : this.renderLoginToComment();

    return html`
      ${titleGroup}${addCmtGroup}${contentGroup}
    `;
  }

  private async handleViewMoreClick() {
    await this.cmtCollector?.loadMoreAsync();
  }

  handleReplyCountChanged(e: CustomEvent<number>) {
    const delta = e.detail;
    this.totalCount += delta;
  }

  private renderLoginToComment() {
    const loginToCommentTextArray = splitLocalizedString(ls.plsLoginToComment);
    return html`
      <div>
        <span>${loginToCommentTextArray[0]}</span>
        <lit-button class="is-success-btn m-l-xs m-r-xs"
          >${loginToCommentTextArray[1]}</lit-button
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
    if (e.detail) {
      this.cmtCollector?.prepend([e.detail.cmt]);
    }
  }

  private handleCmtDeleted(index: number) {
    this.items = this.items.filter((_, idx) => idx !== index);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-list-view': CmtListView;
  }
}
