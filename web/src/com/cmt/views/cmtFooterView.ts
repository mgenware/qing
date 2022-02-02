/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import { formatLS, ls } from 'ls';
import 'ui/status/statusView';
import LoadingStatus from 'lib/loadingStatus';

@customElement('cmt-footer-view')
export class CmtFooterView extends BaseElement {
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

  @lp.object status = LoadingStatus.notStarted;
  @lp.bool hasNext = false;
  @lp.bool replies = false;
  // Whether `loadMore` has been called once.
  @lp.bool hasLoadedOnce = false;
  @lp.number replyCount = 0;

  render() {
    const { status } = this;
    let loadMoreText: string;
    if (this.replies) {
      if (this.hasLoadedOnce) {
        loadMoreText = formatLS(ls.pViewMore, ls.replies);
      } else {
        loadMoreText = formatLS(ls.pNumOfReplies, this.replyCount);
      }
    } else {
      // Always show "More comments" in root-cmt mode.
      // 1. `hasLoadedOnce` is always true in this mode.
      // 2. We don't know how many root level cmts are there.
      loadMoreText = formatLS(ls.pViewMore, ls.comments);
    }
    if (status.isSuccess) {
      if (this.hasNext) {
        return html`
          <div>
            <a href="#" @click=${this.handleMoreButtonClick}>${loadMoreText}</a>
          </div>
        `;
      }
      // If success and `hasNext` is false, nothing to show.
      return html``;
    }

    return html`
      <status-view
        .status=${status}
        .canRetry=${true}
        @onRetry=${this.handleMoreButtonClick}></status-view>
    `;
  }

  private handleMoreButtonClick(e: Event) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent<undefined>('viewMoreClick'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-footer-view': CmtFooterView;
  }
}
