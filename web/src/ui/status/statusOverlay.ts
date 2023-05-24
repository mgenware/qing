/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import { classMap } from 'lit/directives/class-map.js';
import LoadingStatus from 'lib/loadingStatus.js';
import 'ui/status/spinnerView.js';
import 'qing-dock-box';
import '../alerts/errorView';

// Displays a status-view on top of the content view.
// Useful for rendering the status of updating something.
@customElement('status-overlay')
export class StatusOverlay extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        :host([full-height]) {
          height: 100%;
        }

        :host([full-height]) .root-div {
          height: 100%;
        }

        .root-div {
          display: grid;
        }

        .content,
        .overlay {
          grid-area: 1 / 1;
        }

        :host([flex-content]) .content {
          display: flex;
          flex-direction: column;
        }
      `,
    ];
  }

  @property({ type: Object }) status = LoadingStatus.notStarted;
  @property() loadingText = '';
  @property({ type: Boolean }) canRetry = false;
  @property() errorTitle = '';

  override render() {
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
              <qing-dock-box class="overlay height-100">
                ${status.isWorking
                  ? html`
                      <spinner-view>${this.loadingText || globalThis.coreLS.loading}</spinner-view>
                    `
                  : html``}
                ${status.error
                  ? html`
                      <error-view
                        .canRetry=${this.canRetry}
                        .headerText=${this.errorTitle || globalThis.coreLS.errOccurred}
                        @error-view-retry=${this.handleRetry}>
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
    this.dispatchEvent(new CustomEvent('status-overlay-retry'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'status-overlay': StatusOverlay;
  }
}
