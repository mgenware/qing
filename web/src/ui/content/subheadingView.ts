/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';

@customElement('subheading-view')
export class SubheadingView extends BaseElement {
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
    return html` <h3><slot></slot></h3> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'subheading-view': SubheadingView;
  }
}
