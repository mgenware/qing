/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import strf from 'bowhead-js';
import { BaseElement, customElement, html, property } from 'll';

@customElement('item-counter')
export class ItemCounter extends BaseElement {
  @property({ type: Number }) shown = 0;
  @property({ type: Number }) total = 0;

  override render() {
    if (this.total <= 1) {
      return html` <span>${globalThis.coreLS.oneItem}</span> `;
    }
    return html` <span>${strf(globalThis.coreLS.ppItemsCounter, this.shown, this.total)}</span> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'item-counter': ItemCounter;
  }
}
