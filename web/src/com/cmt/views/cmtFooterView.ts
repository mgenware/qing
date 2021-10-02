/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import { formatLS, ls } from 'ls';
import 'ui/status/statusView';
import LoadingStatus from 'lib/loadingStatus';

@ll.customElement('cmt-footer-view')
export class CmtFooterView extends ll.BaseElement {
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

  @ll.object status = LoadingStatus.notStarted;
  @ll.bool hasNext = false;
  @ll.bool replies = false;
  @ll.number loadedCount = 0;

  render() {
    const { status } = this;
    if (status.isSuccess) {
      if (this.hasNext) {
        return ll.html`
          <div>
            <a href="#" @click=${this.handleMoreButtonClick}
              >${formatLS(
                this.loadedCount ? ls.pViewMore : ls.pView,
                this.replies ? ls.replies : ls.comments,
              )}</a
            >
          </div>
        `;
      }
      // If success and `hasNext` is false, nothing to show.
      return ll.html``;
    }

    return ll.html`
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
