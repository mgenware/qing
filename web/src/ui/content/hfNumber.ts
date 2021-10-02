/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import ls from 'ls';

@ll.customElement('hf-number')
export class HFNumber extends ll.BaseElement {
  private formatter: Intl.NumberFormat;
  @ll.reflected.number value = Number.NaN;

  constructor() {
    super();

    this.formatter = new Intl.NumberFormat(ls._lang, { notation: 'compact' });
  }

  override createRenderRoot() {
    return this;
  }

  render() {
    const { value, formatter } = this;
    if (Number.isNaN(value)) {
      return '';
    }
    return ll.html` <span> ${formatter.format(value)} </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hf-number': HFNumber;
  }
}
