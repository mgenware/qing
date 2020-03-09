import { html, customElement, TemplateResult } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'ui/cm/timeField';
import './cmtView';
import Cmt from './cmt';
import CmtCollector from './cmtCollector';
import { EntityType } from 'lib/entity';
import './cmtFooterView';
import LoadingStatus from 'lib/loadingStatus';
import { formatLS, ls } from 'ls';

export interface ReplyCountChangedEventDetail {
  totalCount: number;
  loadedCount: number;
  offset: number;
}

@customElement('reply-list-view')
export class ReplyListView extends BaseElement {
  @lp.string hostID = '';
  @lp.number hostType: EntityType = 0;
  @lp.object cmt: Cmt | null = null;

  @lp.array private items: Cmt[] = [];
  @lp.bool hasNext = false;
  @lp.number page = 1;

  @lp.number totalCount = 0;
  @lp.number loadedCount = 0;

  private replyCollector: CmtCollector | null = null;
  @lp.object private collectorLoadingStatus = LoadingStatus.success;

  firstUpdated() {
    const { cmt } = this;
    if (!cmt) {
      return;
    }
    this.totalCount = cmt.replyCount;
    this.hasNext = this.loadedCount < this.totalCount;
    this.replyCollector = new CmtCollector(
      undefined,
      {
        parentID: cmt.id,
        page: this.page,
      },
      status => {
        this.collectorLoadingStatus = status;
      },
      e => {
        this.items = e.items;
        this.hasNext = e.hasNext;
        this.page = e.page;
        this.loadedCount = e.count;
        const offset = e.newItems.length;
        this.totalCount += offset;
        this.onReplyCountChanged({
          totalCount: this.totalCount,
          loadedCount: this.loadedCount,
          offset,
        });
      },
    );
  }

  render() {
    const { cmt } = this;
    if (!cmt) {
      return;
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
            @cmtDeleted=${() => this.handleReplyDeleted(i)}
          ></cmt-view>
        `,
      );
    }
    return html`
      <div>
        <p>
          ${cmt.replyCount}
        </p>
        <cmt-view
          .hostID=${this.hostID}
          .hostType=${this.hostType}
          .cmt=${cmt}
          @cmtDeleted=${this.handleCmtDeleted}
        ></cmt-view>
        <div class="reply-block">
          ${childViews}
          ${this.totalCount
            ? html`
                <div>
                  <small class="is-secondary"
                    >${formatLS(ls.pNOReplies, this.totalCount)}</small
                  >
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

  private handleCmtDeleted() {
    // Propagate the event and let the outer scope handle this.
    this.dispatchEvent(new CustomEvent<undefined>('rootCmtDeleted'));
  }

  private handleReplyDeleted(index: number) {
    this.items = this.items.filter((_, idx) => idx !== index);
  }

  private onReplyCountChanged(detail: ReplyCountChangedEventDetail) {
    this.dispatchEvent(
      new CustomEvent<ReplyCountChangedEventDetail>('replyCountChanged', {
        detail,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'reply-list-view': ReplyListView;
  }
}
