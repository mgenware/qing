import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import LoadingStatus from 'lib/loadingStatus';
import { formatLS, ls } from 'ls';
import './cmtView';
import Cmt, { CmtCountChangedEventDetail, isReply } from '../data/cmt';
import './cmtFooterView';
import { SetCmtResponse } from '../loaders/setCmtLoader';
import { CHECK } from 'checks';
// eslint-disable-next-line import/no-extraneous-dependencies
import { repeat } from 'lit-html/directives/repeat';
import { CmtDataHub } from '../data/cmtDataHub';
import { ItemsLoadedResponse } from 'lib/itemCollector';
import app from 'app';
import DeleteCmtLoader from '../loaders/deleteCmtLoader';

@customElement('cmt-block')
// Shows a comment view along with its replies.
export class CmtBlock extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .reply-block {
          border-left: 1px solid var(--app-default-separator-color);
          margin-left: 1.5rem;
          padding-left: 1.5rem;
        }
      `,
    ];
  }

  @lp.string hostID = '';
  @lp.number hostType = 0;

  @lp.object cmt!: Cmt;
  @lp.object hub!: CmtDataHub;

  // Can only be changed within `CmtCollector.itemsChanged` event.
  // `CmtCollector` provides paging and duplication removal.
  // DO NOT modify `items` elsewhere.
  @lp.array private items: ReadonlyArray<Cmt> = [];
  @lp.bool hasNext = false;

  // Number of replies under this comment.
  @lp.number totalCount = 0;
  @lp.object private collectorLoadingStatus = LoadingStatus.success;

  firstUpdated() {
    const { cmt, hub } = this;
    CHECK(cmt);
    CHECK(hub);
    CHECK(this.hostID);
    CHECK(this.hostType);

    this.totalCount = cmt.replyCount;
    this.hasNext = !!this.totalCount;

    hub.onChildLoadingStatusChanged(cmt.id, (status) => (this.collectorLoadingStatus = status));
    hub.onChildItemsChanged(cmt.id, (e: ItemsLoadedResponse<Cmt>) => {
      this.items = e.items;
      this.hasNext = e.hasNext;
    });
  }

  render() {
    const { cmt } = this;
    const childViews = repeat(
      this.items,
      (it) => it.id,
      (it) => html`
        <cmt-view
          .cmt=${it}
          .parentCmtID=${cmt.id}
          @cmtDeleted=${this.handleReplyDeleted}
          @cmtAdded=${this.handleReplyCreated}
        ></cmt-view>
      `,
    );
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
    await this.hub.loadMoreAsync(this.cmt.id);
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

  private handleChildReplyClick(e: CustomEvent<Cmt>) {
    const { hub } = this;
    const target = e.detail;
    hub.requestOpenEditor({
      open: true,
      editing: null,
      // No matter we're reply to a comment or reply, we're creating a reply.
      // It must have a parent ID, which is current comment.
      parent: this.cmt,
      replyingTo: target,
    });
  }

  private async handleChildDeleteClick(e: CustomEvent<Cmt>) {
    if (await app.alert.confirm(ls.warning, formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
      app.alert.showLoadingOverlay(ls.working);

      const target = e.detail;
      const loader = new DeleteCmtLoader(target.id, this.hostType, this.hostID, isReply(target));
      const status = await app.runGlobalActionAsync(loader, ls.working);
      if (status.isSuccess) {
        this.hub.removeCmt(this.cmt.id, index);
        this.onReplyCountChanged(-1);
      }
    }
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
    'cmt-block': CmtBlock;
  }
}
