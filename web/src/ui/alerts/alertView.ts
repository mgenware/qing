/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import { AppViewStyleNullable } from 'ui/types/appViewStyle.js';

@customElement('alert-view')
export class AlertView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
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

  @property({ reflect: true }) alertStyle: AppViewStyleNullable = '';

  override render() {
    return html`
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
