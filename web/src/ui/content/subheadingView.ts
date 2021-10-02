/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';

@ll.customElement('subheading-view')
export class SubheadingView extends ll.BaseElement {
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
    return ll.html` <h3><slot></slot></h3> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'subheading-view': SubheadingView;
  }
}
