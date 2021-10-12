/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import { classMap } from 'lit/directives/class-map.js';
import ls from 'ls';
import LoadingStatus from 'lib/loadingStatus';
import 'ui/status/spinnerView';
import 'qing-dock-box';
import '../alerts/errorView';

@customElement('status-overlay')
export class StatusOverlay extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root-div {
          display: grid;
        }

        .content,
        .overlay {
          grid-area: 1 / 1;
        }
      `,
    ];
  }

  @lp.object status = LoadingStatus.notStarted;
  @lp.string loadingText = '';
  @lp.bool canRetry = false;
  @lp.string errorTitle = '';
  @lp.string height = '';

  render() {
    const { status } = this;
    return html`
      <div class="root-div">
        <div
          class=${classMap({
            'content-disabled': !status.isSuccess,
            content: true,
          })}>
          <slot></slot>
        </div>
        ${!status.isSuccess
          ? html`
              <qing-dock-box class="overlay" style=${`height: ${this.height || '100%'}`}>
                ${status.isWorking
                  ? html` <spinner-view>${this.loadingText || ls.loading}</spinner-view> `
                  : html``}
                ${status.error
                  ? html`
                      <error-view
                        .canRetry=${this.canRetry}
                        .headerText=${this.errorTitle || ls.errOccurred}
                        @onRetry=${this.handleRetry}>
                        ${status.error.message}
                      </error-view>
                    `
                  : html``}
              </qing-dock-box>
            `
          : html``}
      </div>
    `;
  }

  private handleRetry() {
    this.dispatchEvent(new CustomEvent('onRetry'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'status-overlay': StatusOverlay;
  }
}
