/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import * as authRoute from '@qing/routes/d/dev/auth';
import * as elementsRoute from '@qing/routes/d/dev/elements';

@customElement('dev-page')
export class DevPage extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        div.root-list a {
          display: block;
          padding: 0.5rem 0;
        }
      `,
    ];
  }

  @lp.string loginUserID = '1';

  override render() {
    return html`
      <h1>qing.dev</h1>
      <hr />
      <div class="root-list">
        <a href=${authRoute.authRoot}>Auth</a>
        <a href=${elementsRoute.elementsRoot}>Elements</a>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dev-page': DevPage;
  }
}
