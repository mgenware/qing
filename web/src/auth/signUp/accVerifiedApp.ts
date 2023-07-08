/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll.js';
import * as pubAuth from '@qing/routes/s/pub/auth.js';

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
      <h1>${globalThis.authLS.yourPwdHasBeenReset}</h1>
      <p>
        <qing-button href=${pubAuth.signIn}>${globalThis.coreLS.signIn}</qing-button>
      </p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'acc-verified-app': AccVerifiedApp;
  }
}
