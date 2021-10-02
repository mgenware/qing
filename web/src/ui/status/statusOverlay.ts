/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import { classMap } from 'lit/directives/class-map.js';
import ls from 'ls';
import LoadingStatus from 'lib/loadingStatus';
import 'ui/status/spinnerView';
import 'qing-dock-box';
import '../alerts/errorView';

@ll.customElement('status-overlay')
export class StatusOverlay extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
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

  @ll.object status = LoadingStatus.notStarted;
  @ll.string loadingText = '';
  @ll.bool canRetry = false;
  @ll.string errorTitle = '';
  @ll.string height = '';

  render() {
    const { status } = this;
    return ll.html`
      <div class="root-div">
        <div
          class=${classMap({
            'content-disabled': !status.isSuccess,
            content: true,
          })}>
          <slot></slot>
        </div>
        ${
          !status.isSuccess
            ? ll.html`
              <qing-dock-box class="overlay" style=${`height: ${this.height || '100%'}`}>
                ${
                  status.isWorking
                    ? ll.html` <spinner-view>${this.loadingText || ls.loading}</spinner-view> `
                    : ll.html``
                }
                ${
                  status.error
                    ? ll.html`
                      <error-view
                        .canRetry=${this.canRetry}
                        .headerText=${this.errorTitle || ls.errOccurred}
                        @onRetry=${this.handleRetry}>
                        ${status.error.message}
                      </error-view>
                    `
                    : ll.html``
                }
              </qing-dock-box>
            `
            : ll.html``
        }
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
