/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import LoadingStatus from 'lib/loadingStatus.js';
import '../alerts/errorView';
import './spinnerView';

// A status view used to display `LoadingStatus`.
// It has 3 states: loading, success and error.
@customElement('status-view')
export class StatusView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .withPaddingMD {
          min-height: 400px;
        }

        .spinner-container {
          display: grid;
          place-items: center;
        }
      `,
    ];
  }

  // The underlying status of this view.
  @property({ type: Object }) status = LoadingStatus.notStarted;
  // The loading text when in loading state.
  @property() loadingText = '';
  // If a "retry" button is displayed when in error state.
  @property({ type: Boolean }) canRetry = false;
  // The title of error state view.
  @property() errorTitle = '';

  @property() progressViewPadding: 'md' | '' = '';

  override render() {
    const { status } = this;
    if (status.isWorking) {
      return html`
        <div
          class="spinner-container"
          class=${this.progressViewPadding === 'md' ? 'withPaddingMD' : ''}>
          <spinner-view>${this.loadingText || globalThis.coreLS.loading}</spinner-view>
        </div>
      `;
    }
    if (status.error) {
      return html`
        <error-view
          .canRetry=${this.canRetry}
          .headerText=${this.errorTitle || globalThis.coreLS.errOccurred}
          @error-view-retry=${this.handleRetry}>
          ${status.error.message}
        </error-view>
      `;
    }
    return html``;
  }

  private handleRetry() {
    this.dispatchEvent(new CustomEvent('status-view-retry'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'status-view': StatusView;
  }
}
