/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import routes from './devRoutes';

@ll.customElement('dev-view')
export class DevView extends ll.BaseElement {
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

  @ll.string loginUserID = '1';

  render() {
    return ll.html`
      <h1>Qing Debug Page</h1>
      <hr />
      <ul>
        <li><a href=${routes.authRoot}>Auth</a></li>
        <li><a href=${routes.elements}>Elements</a></li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dev-view': DevView;
  }
}
