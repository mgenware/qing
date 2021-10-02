/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable class-methods-use-this */
import * as ll from 'll';

@ll.customElement('button-list')
export class ButtonList extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: block;
        }

        ::slotted(qing-button:not(:first-child)) {
          margin-left: 1.2rem;
        }
      `,
    ];
  }

  render() {
    return ll.html` <div><slot></slot></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'button-list': ButtonList;
  }
}
