/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';

@customElement('input-error-view')
export class InputErrorView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }

        div {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          color: var(--app-default-danger-fore-color);
          border-radius: 4px;
        }
      `,
    ];
  }

  @property() message = '';

  override render() {
    const { message } = this;
    if (!message) {
      return html``;
    }
    return html` <div>${message}</div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'input-error-view': InputErrorView;
  }
}
