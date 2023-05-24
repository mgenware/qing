/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';

@customElement('notice-view')
export class NoticeView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root {
          font-size: 1.6rem;
          color: var(--app-default-secondary-fore-color);
          display: grid;
          place-items: center;
        }
      `,
    ];
  }

  @property() height = '400px';

  override render() {
    return html` <div class="root" style=${`height:${this.height}`}><slot></slot></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'notice-view': NoticeView;
  }
}
