/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';

@customElement('check-box')
export class CheckBox extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        /** Checkbox */
        /** https://www.w3schools.com/howto/howto_css_custom_checkbox.asp */
        label > input[type='checkbox'] {
          display: none;
        }
        label > input[type='checkbox'] + *::before {
          content: '';
          display: inline-block;
          vertical-align: bottom;
          width: 1.2rem;
          height: 1.2rem;
          margin-right: 0.3rem;
          border-radius: 10%;
          border-style: solid;
          border-width: 0.1rem;
          border-color: var(--app-default-secondary-fore-color);
        }
        label > input[type='checkbox']:checked + * {
          font-weight: bold;
        }
        label > input[type='checkbox']:checked + *::before {
          content: '✓';
          color: var(--app-primary-fore-color);
          text-align: center;
          background: var(--app-primary-back-color);
          border-color: var(--app-primary-back-color);
        }
      `,
    ];
  }

  @lp.reflected.bool checked = false;

  render() {
    return html`<label>
      <input type="checkbox" .checked=${this.checked} @change=${this.handleOnChange} />
      <span><slot></slot></span>
    </label>`;
  }

  private handleOnChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent<boolean>('check', { detail: checked }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'check-box': CheckBox;
  }
}
