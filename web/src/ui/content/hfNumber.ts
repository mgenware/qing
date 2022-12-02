/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, property } from 'll';

@customElement('hf-number')
export class HFNumber extends BaseElement {
  private formatter: Intl.NumberFormat;
  @property({ type: Number, reflect: true }) value = Number.NaN;

  constructor() {
    super();

    this.formatter = new Intl.NumberFormat(globalThis.coreLS.qingLang, { notation: 'compact' });
  }

  override createRenderRoot() {
    return this;
  }

  override render() {
    const { value, formatter } = this;
    if (Number.isNaN(value)) {
      return '';
    }
    return html` <span> ${formatter.format(value)} </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hf-number': HFNumber;
  }
}
