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

        /** Radio-box */
        /** https://dev.to/kallmanation/styling-a-radio-button-with-only-css-4llc */
        label > input[type='radio'] {
          display: none;
        }
        label > input[type='radio'] + *::before {
          content: '';
          display: inline-block;
          vertical-align: bottom;
          width: 1.2rem;
          height: 1.2rem;
          margin-right: 0.3rem;
          border-radius: 50%;
          border-style: solid;
          border-width: 0.1rem;
          border-color: var(--app-default-secondary-fore-color);
        }
        label > input[type='radio']:checked + * {
          font-weight: bold;
        }
        label > input[type='radio']:checked + *::before {
          background: radial-gradient(
            var(--app-default-primary-fore-color) 0%,
            var(--app-default-primary-fore-color) 40%,
            transparent 50%,
            transparent
          );
          border-color: var(--app-default-primary-fore-color);
        }
      `,
    ];
  }

  @lp.reflected.bool checked = false;
  @lp.reflected.bool disabled = false;
  @lp.reflected.bool radio = false;

  render() {
    return html`<label class=${this.disabled ? 'content-disabled' : ''}>
      <input
        type=${this.radio ? 'radio' : 'checkbox'}
        .checked=${this.checked}
        @change=${this.handleOnChange} />
      <span><slot></slot></span>
    </label>`;
  }

  private handleOnChange(e: Event) {
    const { checked } = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent<boolean>('checked', { detail: checked }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'check-box': CheckBox;
  }
}
