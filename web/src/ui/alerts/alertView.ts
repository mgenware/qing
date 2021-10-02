/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import { AppViewStyleNullable } from 'ui/types/appViewStyle';

@ll.customElement('alert-view')
export class AlertView extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: block;
        }

        .root {
          padding: 0.75rem 1rem;
          border: 1px solid var(--alert-border-color, var(--app-default-secondary-fore-color));
          border-left-width: 5px;
        }
      `,
    ];
  }

  @ll.reflected.string alertStyle: AppViewStyleNullable = '';

  render() {
    return ll.html`
      <div class="root">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'alert-view': AlertView;
  }
}
