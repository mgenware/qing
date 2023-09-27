/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import './noticeView';

@customElement('no-content-view')
export class NoContentView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @property() message = '';

  override render() {
    return html`
      <notice-view>${this.message || globalThis.coreLS.noContentAvailable}</notice-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'no-content-view': NoContentView;
  }
}
