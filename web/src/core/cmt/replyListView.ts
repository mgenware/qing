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

@customElement('reply-list-view')
export class ReplyListView extends BaseElement {
  @lp.string entityID = '';
  @lp.number entityType: EntityType = 0;
  @lp.object cmt: Cmt | null = null;

  // Members of `ItemsChangedEventArgs`:
  @lp.array private items: Cmt[] = [];
  @lp.bool hasNext = false;
  @lp.number page = 1;
  @lp.number count = 0;
  @lp.number actualCount = 0;

  private replyCollector: CmtCollector | null = null;
  @lp.object private collectorLoadingStatus = LoadingStatus.empty;

  firstUpdated() {
    const { cmt } = this;
    if (!cmt) {
      return;
    }
    this.replyCollector = new CmtCollector(
      this.entityID,
      this.entityType,
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
              new CustomEvent<number>('repliesCountChanged', { detail: delta }),
            );
          }
        }
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
            .cmt=${item}
            @cmtDeleted=${() => this.handleReplyDeleted(i)}
          ></cmt-view>
        `,
      );
    }
    return html`
      <div>
        <cmt-view
          .cmt=${this.cmt}
          @cmtDeleted=${this.handleCmtDeleted}
        ></cmt-view>
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
}

declare global {
  interface HTMLElementTagNameMap {
    'reply-list-view': ReplyListView;
  }
}
