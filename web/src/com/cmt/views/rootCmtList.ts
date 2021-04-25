/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import { ls, formatLS } from 'ls';
import { splitLocalizedString } from 'lib/stringUtils';
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

  @lp.string hostID = '';
  @lp.number hostType = 0;

  // Starts loading comment when the component is first visible.
  @lp.bool loadOnVisible = false;

  // Can only be changed within `CmtCollector.itemsChanged` event.
  // `CmtCollector` provides paging and duplication removal.
  // DO NOT modify `items` elsewhere.
  @lp.array private items: readonly Cmt[] = [];
  @lp.bool hasNext = false;

  @lp.object collectorLoadingStatus = LoadingStatus.notStarted;

  hub?: CmtDataHub;

  firstUpdated() {
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
      listenForVisibilityChange([this], () => this.loadMore());
    } else {
      this.loadMore();
    }
    this.hub = hub;
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
        // Use p-t-md instead of m-t-md to prevent margin-collapsing with
        // load-more-button of previous `cmt-block`.
        (it) =>
          html`
            <cmt-block
              class="p-t-md"
              .hostType=${this.hostType}
              .hostID=${this.hostID}
              .cmt=${it}
            ></cmt-block>
          `,
      );
      contentGroup = html`
        <div class="m-t-md">
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
            class="m-t-sm"
            .status=${this.collectorLoadingStatus}
            .hasNext=${this.hasNext}
            .loadedCount=${this.items.length}
            @viewMoreClick=${this.handleViewMoreClick}
          ></cmt-footer-view>
        </div>
      `;
    }

    const addCmtGroup = appPageState.user
      ? this.renderCommentComposer()
      : this.renderLoginToComment();

    return html` ${titleGroup}${addCmtGroup}${contentGroup} `;
  }

  private async handleViewMoreClick() {
    await this.loadMore();
  }

  private async loadMore() {
    await this.hub?.loadMoreAsync();
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
