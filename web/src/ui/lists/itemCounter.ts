/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import { formatLS, ls } from 'ls';

@ll.customElement('item-counter')
export class ItemCounter extends ll.BaseElement {
  @ll.number shown = 0;
  @ll.number total = 0;

  render() {
    if (this.total <= 1) {
      return ll.html` <span>${ls.oneItem}</span> `;
    }
    return ll.html` <span>${formatLS(ls.ppItemsCounter, this.shown, this.total)}</span> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'item-counter': ItemCounter;
  }
}
