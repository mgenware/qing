/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html } from 'll';
import * as lp from 'lit-props';
import { formatLS, ls } from 'ls';

@customElement('item-counter')
export class ItemCounter extends BaseElement {
  @lp.number shown = 0;
  @lp.number total = 0;

  render() {
    if (this.total <= 1) {
      return html` <span>${ls.oneItem}</span> `;
    }
    return html` <span>${formatLS(ls.ppItemsCounter, this.shown, this.total)}</span> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'item-counter': ItemCounter;
  }
}
