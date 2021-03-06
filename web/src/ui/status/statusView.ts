/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import ls from 'ls';
import LoadingStatus from 'lib/loadingStatus';
import '../alerts/errorView';
import './spinnerView';
import 'qing-dock-box';

// A status view used to display `LoadingStatus`.
// It has 3 states: loading, success and error.
@customElement('status-view')
export class StatusView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .withPaddingMD {
          min-height: 400px;
        }
      `,
    ];
  }

  // The underlying status of this view.
  @lp.object status = LoadingStatus.notStarted;
  // The loading text when in loading state.
  @lp.string loadingText = '';
  // If a "retry" button is displayed when in error state.
  @lp.bool canRetry = false;
  // The title of error state view.
  @lp.string errorTitle = '';

  @lp.string progressViewPadding: 'md' | '' = '';

  render() {
    const { status } = this;
    if (status.isWorking) {
      return html`
        <qing-dock-box class=${this.progressViewPadding === 'md' ? 'withPaddingMD' : ''}
          ><spinner-view>${this.loadingText || ls.loading}</spinner-view></qing-dock-box
        >
      `;
    }
    if (status.error) {
      return html`
        <error-view
          .canRetry=${this.canRetry}
          .headerText=${this.errorTitle || ls.errOccurred}
          @onRetry=${this.handleRetry}
        >
          ${status.error.message}
        </error-view>
      `;
    }
    return html``;
  }

  private handleRetry() {
    this.dispatchEvent(new CustomEvent('onRetry'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'status-view': StatusView;
  }
}
