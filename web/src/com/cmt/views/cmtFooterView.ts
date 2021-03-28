/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
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
  @lp.number loadedCount = 0;

  render() {
    const { status } = this;
    if (status.isSuccess) {
      if (this.hasNext) {
        return html`
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
      return html``;
    }

    return html`
      <status-view
        .status=${status}
        .canRetry=${true}
        @onRetry=${this.handleMoreButtonClick}
      ></status-view>
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
