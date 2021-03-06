/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css, html, BaseElement, lp } from 'll';
import 'qing-dock-box';

@customElement('notice-view')
export class NoticeView extends BaseElement {
  static get styles() {
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

  @lp.string height = '400px';

  render() {
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
