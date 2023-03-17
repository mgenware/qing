/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import 'qing-dock-box';

@customElement('notice-view')
export class NoticeView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root-container {
          font-size: 1.6rem;
          color: var(--app-default-secondary-fore-color);
        }
      `,
    ];
  }

  @property() height = '400px';

  override render() {
    return html`
      <qing-dock-box class="root-container" style=${`height:${this.height}`}
        ><slot></slot
      ></qing-dock-box>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'notice-view': NoticeView;
  }
}
