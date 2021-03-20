import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import LoadingStatus from 'lib/loadingStatus';
import { formatLS, ls } from 'ls';
import './cmtView';
import Cmt, { isCmtReply } from '../data/cmt';
import './cmtFooterView';
import { CHECK } from 'checks';
// eslint-disable-next-line import/no-extraneous-dependencies
import { repeat } from 'lit-html/directives/repeat';
import { CmtDataHub } from '../data/cmtDataHub';
import app from 'app';
import DeleteCmtLoader from '../loaders/deleteCmtLoader';
import { ItemsChangedDetail } from 'lib/itemCollector';

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

  @lp.object cmt: Cmt | null = null;
  @lp.object hub: CmtDataHub | null = null;

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
    hub.onChildItemsChanged(cmt.id, (e: ItemsChangedDetail<Cmt>) => {
      this.items = e.items;
      this.hasNext = e.hasNext;
      this.totalCount = e.totalCount;
    });
  }

  render() {
    const { cmt } = this;
    CHECK(cmt);
    const childViews = repeat(
      this.items,
      (it) => it.id,
      (it) => html`
        <cmt-view
          .cmt=${it}
          .parentCmtID=${cmt.id}
          @replyClick=${this.handleCmtReplyClick}
          @editClick=${this.handleCmtEditClick}
          @deleteClick=${this.handleCmtDeleteClick}
        ></cmt-view>
      `,
    );
    return html`
      <div>
        <cmt-view
          .hostID=${this.hostID}
          .hostType=${this.hostType}
          .cmt=${cmt}
          @replyClick=${this.handleCmtReplyClick}
          @editClick=${this.handleCmtEditClick}
          @deleteClick=${this.handleCmtDeleteClick}
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
    CHECK(this.hub);
    CHECK(this.cmt);
    await this.hub.loadMoreAsync(this.cmt.id);
  }

  private handleCmtReplyClick(e: CustomEvent<Cmt>) {
    CHECK(this.hub);
    CHECK(this.cmt);
    const { hub } = this;
    const target = e.detail;
    const isReply = isCmtReply(target);
    hub.requestOpenEditor({
      open: true,
      editing: null,
      // No matter we're reply to a comment or reply, we're creating a reply.
      // It must have a parent ID, which is current comment.
      parent: isReply ? this.cmt : null,
      replyingTo: target,
    });
  }

  private async handleCmtDeleteClick(e: CustomEvent<Cmt>) {
    CHECK(this.hub);
    CHECK(this.cmt);
    if (await app.alert.confirm(ls.warning, formatLS(ls.pDoYouWantToDeleteThis, ls.post))) {
      app.alert.showLoadingOverlay(ls.working);

      const target = e.detail;
      const isReply = isCmtReply(target);
      const loader = new DeleteCmtLoader(target.id, this.hostType, this.hostID, isReply);
      const status = await app.runGlobalActionAsync(loader, ls.working);
      if (status.isSuccess) {
        this.hub.removeCmt(isReply ? this.cmt.id : null, target.id);
      }
    }
  }

  private handleCmtEditClick(e: CustomEvent<Cmt>) {
    CHECK(this.hub);
    CHECK(this.cmt);
    const { hub } = this;
    const target = e.detail;
    const isReply = isCmtReply(target);
    hub.requestOpenEditor({
      open: true,
      editing: target,
      // No matter we're reply to a comment or reply, we're creating a reply.
      // It must have a parent ID, which is current comment.
      parent: isReply ? this.cmt : null,
      replyingTo: null,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-block': CmtBlock;
  }
}
