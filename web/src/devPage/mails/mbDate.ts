/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';

@customElement('mb-date')
export class MBDate extends BaseElement {
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

  @property({ type: Number }) ts = 0;

  override render() {
    return html` <blockquote>${new Date((this.ts || 0) * 1000)}</blockquote> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-date': MBDate;
  }
}
