/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';

@customElement('label-view')
export class LabelView extends BaseElement {
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

  @lp.string for = '';

  override render() {
    return html`<label class="app-form-label" for=${this.for}><slot></slot></label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'label-view': LabelView;
  }
}
