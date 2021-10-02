/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';

@ll.customElement('input-error-view')
export class InputErrorView extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
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

  @ll.string message = '';

  render() {
    const { message } = this;
    if (!message) {
      return ll.html``;
    }
    return ll.html` <div>${message}</div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'input-error-view': InputErrorView;
  }
}
