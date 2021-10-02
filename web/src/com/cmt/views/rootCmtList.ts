/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import { ls, formatLS } from 'ls';
import LoadingStatus from 'lib/loadingStatus';
import { listenForVisibilityChange } from 'lib/htmlLib';
import Cmt from '../data/cmt';
import './cmtBlock';
import './cmtFooterView';
import { repeat } from 'lit/directives/repeat.js';
import { CmtDataHub } from '../data/cmtDataHub';
import { CHECK } from 'checks';
import appPageState from 'app/appPageState';
import appCmtHubState from '../data/appCmtHubState';
import { parseString } from 'narwhal-js';

@ll.customElement('root-cmt-list')
// Displays a list of <cmt-block>.
export class RootCmtList extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: block;
        }
      `,
    ];
  }

  // The number of all comments and their replies.
  @ll.number totalCmtCount = 0;

  @ll.string hostID = '';
  @ll.number hostType = 0;

  // Starts loading comment when the component is first visible.
  @ll.bool loadOnVisible = false;

  // Can only be changed within `CmtCollector.itemsChanged` event.
  // `CmtCollector` provides paging and duplication removal.
  // DO NOT modify `items` elsewhere.
  @ll.array private items: readonly Cmt[] = [];
  @ll.bool hasNext = false;

  @ll.object collectorLoadingStatus = LoadingStatus.notStarted;

  hub?: CmtDataHub;

  async firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);

    const hub = appCmtHubState.getHub(this.hostType, this.hostID);
    CHECK(hub);
    hub.rootLoadingStatusChanged.on((status) => {
      this.collectorLoadingStatus = status;
    });
    hub.rootItemsChanged.on((e) => {
      this.items = e.items;
      this.hasNext = e.hasNext;
      // Ignore `e.totalCount`, it's useless for root collector.
      // See `totalCmtCount` in `cmt-app`.
    });

    if (this.loadOnVisible) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      listenForVisibilityChange([this], () => this.loadMore());
    } else {
      await this.loadMore();
    }
    this.hub = hub;
  }

  render() {
    if (!appPageState.user) {
      return this.renderLoginToComment();
    }

    const { totalCmtCount, collectorLoadingStatus } = this;
    let titleGroup = ll.html` <h2>${ls.comments}</h2> `;
    let contentGroup = ll.html``;

    if (!totalCmtCount && (collectorLoadingStatus.isSuccess || !collectorLoadingStatus.isStarted)) {
      titleGroup = ll.html`
        ${titleGroup}
        <p>${ls.noComments}</p>
      `;
    } else {
      const childViews = repeat(
        this.items,
        (it) => it.id,
        // Use p-t-md instead of m-t-md to prevent margin-collapsing with
        // load-more-button of previous `cmt-block`.
        (it) =>
          ll.html`
            <cmt-block
              class="p-t-md"
              .hostType=${this.hostType}
              .hostID=${this.hostID}
              .cmt=${it}></cmt-block>
          `,
      );
      contentGroup = ll.html`
        <div class="m-t-md">
          <div>${childViews}</div>
          ${
            this.totalCmtCount
              ? ll.html`
                <div>
                  <small class="is-secondary"
                    >${formatLS(ls.pNOComments, this.totalCmtCount)}</small
                  >
                </div>
              `
              : ll.html``
          }
          <cmt-footer-view
            class="m-t-sm"
            .status=${this.collectorLoadingStatus}
            .hasNext=${this.hasNext}
            .loadedCount=${this.items.length}
            @viewMoreClick=${this.handleViewMoreClick}></cmt-footer-view>
        </div>
      `;
    }

    const addCmtGroup = this.renderCommentComposer();
    return ll.html` ${titleGroup}${addCmtGroup}${contentGroup} `;
  }

  private async handleViewMoreClick() {
    await this.loadMore();
  }

  private async loadMore() {
    await this.hub?.loadMoreAsync();
  }

  private renderLoginToComment() {
    return ll.html`
      <div>
        ${parseString(ls.plsLoginToComment).map((sg) => {
          if (!sg.type) {
            return ll.html`<span>${sg.value}</span>`;
          }
          return ll.html`<qing-button btnStyle="success" class="m-l-xs m-r-xs"
            >${sg.value}</qing-button
          >`;
        })}
      </div>
    `;
  }

  private renderCommentComposer() {
    return ll.html`
      <p>
        <qing-button btnStyle="success" @click=${this.handleAddCommentButtonClick}
          >${ls.writeAComment}</qing-button
        >
      </p>
    `;
  }

  private handleAddCommentButtonClick() {
    this.hub?.openEditorRequested.dispatch({
      open: true,
      parent: null,
      editing: null,
      replyingTo: null,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'root-cmt-list': RootCmtList;
  }
}
