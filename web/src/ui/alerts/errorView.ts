/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import 'ui/alerts/alertView.js';

@customElement('error-view')
export class ErrorView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @property() headerText = '';
  @property({ type: Boolean }) canRetry = false;

  override render() {
    return html`
      <alert-view alertStyle="danger">
        <h3>${this.headerText || globalThis.coreLS.errOccurred}</h3>
        <p><slot></slot></p>

        ${this.canRetry
          ? html`
              <div class="m-t-md">
                <qing-button btnStyle="primary" @click=${this.handleRetryClick}>
                  ${globalThis.coreLS.retry}
                </qing-button>
              </div>
            `
          : ''}
      </alert-view>
    `;
  }

  private handleRetryClick() {
    this.dispatchEvent(new CustomEvent('error-view-retry'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'error-view': ErrorView;
  }
}
