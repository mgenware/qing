/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import LoadingStatus from 'lib/loadingStatus';
import { formatLS, ls } from 'ls';
import './cmtView';
import Cmt, { isCmtReply } from '../data/cmt';
import './cmtFooterView';
import { CHECK } from 'checks';
import { repeat } from 'lit/directives/repeat.js';
import { CmtDataHub } from '../data/cmtDataHub';
import { ItemsChangedEvent } from 'lib/itemCollector';
import appAlert from 'app/appAlert';
import appCmtHubState from '../data/appCmtHubState';

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

  // Can only be changed within `CmtCollector.itemsChanged` event.
  // `CmtCollector` provides paging and duplication removal.
  // DO NOT modify `items` elsewhere.
  @lp.array private items: ReadonlyArray<Cmt> = [];
  @lp.bool hasNext = false;

  // Number of replies under this comment.
  @lp.number totalCount = 0;
  @lp.object private collectorLoadingStatus = LoadingStatus.success;

  hub?: CmtDataHub;

  firstUpdated() {
    const { cmt } = this;
    CHECK(cmt);

    this.totalCount = cmt.replyCount;
    this.hasNext = !!this.totalCount;

    const hub = appCmtHubState.getHub(this.hostType, this.hostID);
    CHECK(hub);
    hub.onChildLoadingStatusChanged(cmt.id, (status) => (this.collectorLoadingStatus = status));
    hub.onChildItemsChanged(cmt.id, (e: ItemsChangedEvent<Cmt>) => {
      this.items = e.items;
      this.hasNext = e.hasNext;
      this.totalCount = e.totalCount;
    });
    this.hub = hub;
  }

  render() {
    const { cmt } = this;
    CHECK(cmt);
    const childViews = repeat(
      this.items,
      (it) => it.id,
      (it) => html`
        <cmt-view
          class="m-t-md"
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
            class="m-t-sm m-b-md"
            .replies=${true}
            .status=${this.collectorLoadingStatus}
            .hasNext=${this.hasNext}
            .loadedCount=${this.items.length}
            @viewMoreClick=${this.handleMoreRepliesClick}
          ></cmt-footer-view>
        </div>
      </div>
    `;
  }

  private async handleMoreRepliesClick() {
    CHECK(this.hub);
    CHECK(this.cmt);
    await this.hub.loadMoreAsync(this.cmt.id);
  }

  private handleCmtReplyClick(e: CustomEvent<Cmt>) {
    CHECK(this.hub);
    CHECK(this.cmt);
    const { hub } = this;
    const target = e.detail;
    hub.openEditorRequested.dispatch({
      open: true,
      editing: null,
      // No matter we're reply to a comment or reply, we're creating a reply.
      // It must have a parent ID, which is current comment.
      parent: this.cmt,
      replyingTo: target,
    });
  }

  private async handleCmtDeleteClick(e: CustomEvent<Cmt>) {
    CHECK(this.hub);
    CHECK(this.cmt);
    if (await appAlert.confirm(ls.warning, formatLS(ls.pDoYouWantToDeleteThis, ls.comment))) {
      this.hub.deleteCmtRequested.dispatch([this.cmt.id, e.detail]);
    }
  }

  private handleCmtEditClick(e: CustomEvent<Cmt>) {
    CHECK(this.hub);
    CHECK(this.cmt);
    const { hub } = this;
    const target = e.detail;
    const isReply = isCmtReply(target);
    hub.openEditorRequested.dispatch({
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
