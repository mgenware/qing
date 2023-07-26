/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll.js';
import * as authPages from '@qing/routes/auth.js';

@customElement('acc-verified-app')
export class AccVerifiedApp extends BaseElement {
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

  override render() {
    return html`
      <div class="text-center">
        <h1>${globalThis.authLS.yourAccHasBeenVerified}</h1>
        <p>
          <qing-button btnStyle="success" href=${authPages.signIn}
            >${globalThis.coreLS.signIn}</qing-button
          >
        </p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'acc-verified-app': AccVerifiedApp;
  }
}
