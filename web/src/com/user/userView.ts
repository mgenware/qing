/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';

@ll.customElement('user-view')
export class UserView extends ll.BaseElement {
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

  render() {
    return ll.html`
      <div class="m-t-md row m-user-view">
        <div class="col-auto">
          <slot name="link"></slot>
        </div>
        <div class="col">
          <div><slot name="name"></slot></div>
          <p>
            <slot name="status"></slot>
          </p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-view': UserView;
  }
}
