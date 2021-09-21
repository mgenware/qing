/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement } from 'll';

@customElement('user-view')
export class UserView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  render() {
    return html`
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
