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

@customElement('cmt-load-more-view')
export class CmtLoadMoreView extends BaseElement {
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

  render() {
    const { status } = this;
    let loadMoreText: string;
    if (this.replies) {
      loadMoreText = formatLS(ls.pViewMore, ls.replies);
    } else {
      loadMoreText = formatLS(ls.pViewMore, ls.comments);
    }
    if (status.isSuccess) {
      if (this.hasNext) {
        return html`
          <div>
            <link-button @click=${this.handleMoreButtonClick}>${loadMoreText}</link-button>
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
    'cmt-load-more-view': CmtLoadMoreView;
  }
}
