/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';

@ll.customElement('label-view')
export class LabelView extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
            :host {
              display: block;
            }
          `,
    ];
  }

  @ll.string for = '';

  render() {
    return ll.html`<label class="app-form-label" for=${this.for}><slot></slot></label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'label-view': LabelView;
  }
}
