/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import ls from 'ls';
import 'ui/alerts/alertView';

@ll.customElement('error-view')
export class ErrorView extends ll.BaseElement {
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

  @ll.string headerText = '';
  @ll.bool canRetry = false;

  render() {
    return ll.html`
      <alert-view alertStyle="danger">
        <h3>${this.headerText || ls.errOccurred}</h3>
        <p><slot></slot></p>

        ${
          this.canRetry
            ? ll.html`
              <div class="m-t-md">
                <qing-button btnStyle="primary" @click=${this.handleRetryClick}>
                  ${ls.retry}
                </qing-button>
              </div>
            `
            : ''
        }
      </alert-view>
    `;
  }

  private handleRetryClick() {
    this.dispatchEvent(new CustomEvent('onRetry'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'error-view': ErrorView;
  }
}
