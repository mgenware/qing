import { html, customElement, TemplateResult, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'ui/cm/timeField';
import LoadingStatus from 'lib/loadingStatus';
import { formatLS, ls } from 'ls';
import { EntityType } from 'lib/entity';
import './cmtView';
import Cmt, { CmtCountChangedEventDetail } from './cmt';
import CmtCollector from './cmtCollector';
import './cmtFooterView';
import { SetCmtResponse } from './loaders/setCmtLoader';

@customElement('reply-list-view')
export class ReplyListView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .reply-block {
          margin-left: 65px;
        }
      `,
    ];
  }

  @lp.string hostID = '';
  @lp.number hostType: EntityType = 0;
  @lp.object cmt: Cmt | null = null;

  // Can only be changed within `CmtCollector.itemsChanged` event.
  // `CmtCollector` provides paging and duplication removal.
  // DO NOT modify `items` elsewhere.
  @lp.array private items: Cmt[] = [];
  @lp.bool hasNext = false;
  @lp.number page = 1;

  // Number of replies under this comment.
  @lp.number totalCount = 0;

  private replyCollector: CmtCollector | null = null;
  @lp.object private collectorLoadingStatus = LoadingStatus.success;

  firstUpdated() {
    const { cmt } = this;
    if (!cmt) {
      return;
    }
    this.totalCount = cmt.replyCount;
    this.hasNext = !!this.totalCount;
    this.replyCollector = new CmtCollector(
      undefined,
      {
        parentCmtID: cmt.id,
        page: this.page,
      },
      (status) => {
        this.collectorLoadingStatus = status;
      },
      (e) => {
        this.items = e.items;
        this.hasNext = e.hasNext;
        this.page = e.page;
      },
    );
  }

  render() {
    const { cmt } = this;
    if (!cmt) {
      return html``;
    }
    const childViews: TemplateResult[] = [];
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      childViews.push(
        html`
          <cmt-view
            .hostID=${this.hostID}
            .hostType=${this.hostType}
            .cmt=${item}
            .parentCmtID=${cmt.id}
            @cmtDeleted=${this.handleReplyDeleted}
            @cmtAdded=${this.handleReplyCreated}
          ></cmt-view>
        `,
      );
    }
    return html`
      <div>
        <cmt-view
          .hostID=${this.hostID}
          .hostType=${this.hostType}
          .cmt=${cmt}
          @cmtDeleted=${this.handleRootCmtDeleted}
          @cmtAdded=${this.handleReplyCreated}
        ></cmt-view>
        <div class="reply-block">
          ${childViews}
          ${this.totalCount
            ? html`
                <div>
                  <small class="is-secondary">${formatLS(ls.pNOReplies, this.totalCount)}</small>
                </div>
              `
            : html``}
          <cmt-footer-view
            .replies=${true}
            .status=${this.collectorLoadingStatus}
            .hasNext=${this.hasNext}
            .loadedCount=${this.items.length}
            @viewMoreClick=${this.handleViewMoreClick}
          ></cmt-footer-view>
        </div>
      </div>
    `;
  }

  private async handleViewMoreClick() {
    await this.replyCollector?.loadMoreAsync();
  }

  private handleRootCmtDeleted() {
    const detail: CmtCountChangedEventDetail = {
      count: this.totalCount,
      offset: -1,
    };
    this.dispatchEvent(
      new CustomEvent<CmtCountChangedEventDetail>('rootCmtDeleted', {
        detail,
      }),
    );
  }

  private handleReplyCreated(e: CustomEvent<SetCmtResponse>) {
    this.replyCollector?.append([e.detail.cmt]);
    this.onReplyCountChanged(1);
  }

  private handleReplyDeleted(index: number) {
    this.replyCollector?.deleteByIndex(index);
    this.onReplyCountChanged(-1);
  }

  private onReplyCountChanged(offset: number) {
    this.totalCount += offset;
    this.dispatchEvent(
      new CustomEvent<CmtCountChangedEventDetail>('replyCountChanged', {
        detail: {
          offset,
          count: this.totalCount,
        },
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'reply-list-view': ReplyListView;
  }
}
