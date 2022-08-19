/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import { ifDefined } from 'lit/directives/if-defined.js';
import debounceFn from 'lib/debounce';
import { formatLS, ls } from 'ls';
import { ERR } from 'checks';
import './inputErrorView';

const inputID = 'input-id';

export type InputTypeValues =
  | 'hidden'
  | 'text'
  | 'search'
  | 'tel'
  | 'url'
  | 'email'
  | 'password'
  | 'datetime'
  | 'date'
  | 'month'
  | 'week'
  | 'time'
  | 'datetime-local'
  | 'number'
  | 'range'
  | 'color'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'submit'
  | 'image'
  | 'reset'
  | 'button';

export type AutoCompleteValues =
  | 'on'
  | 'off'
  | 'name'
  | 'honorific-prefix'
  | 'given-name'
  | 'additional-name'
  | 'family-name'
  | 'honorific-suffix'
  | 'nickname'
  | 'email'
  | 'username'
  | 'new-password'
  | 'current-password'
  | 'one-time-code'
  | 'organization-title'
  | 'organization'
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level4'
  | 'address-level3'
  | 'address-level2'
  | 'address-level1'
  | 'country'
  | 'country-name'
  | 'postal-code'
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-additional-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-currency'
  | 'transaction-amount'
  | 'language'
  | 'bday'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'sex'
  | 'search'
  | 'tel'
  | 'tel-country-code'
  | 'tel-national'
  | 'tel-area-code'
  | 'tel-local'
  | 'tel-extension'
  | 'impp'
  | 'url'
  | 'photo';

@customElement('input-view')
// Text input view (block). Use `app-inline-text-input` in `app.css` for inline inputs.
export class InputView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        input {
          font-size: 1rem;
          max-width: 100%;
          width: 100%;
          line-height: 1.5;
          background-color: transparent;
          color: var(--app-default-fore-color);
          border: 1px solid var(--app-default-separator-color);
          padding: 0.35rem 0.6rem;
          border-radius: var(--app-surface-radius-sm);
        }

        input:focus {
          outline: 0;
          border-color: var(--app-keyboard-focus-color);
          box-shadow: 0 0 2px var(--app-keyboard-focus-color);
        }

        /** the 'validated' class makes sure invalid style doesn't appear on page load. */
        input.validated:invalid {
          outline: 0;
          border-color: var(--app-default-danger-fore-color);
          box-shadow: 0 0 2px var(--app-default-danger-fore-color);
        }
      `,
    ];
  }

  @property({ reflect: true }) label = '';
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ reflect: true }) type: InputTypeValues = 'text';
  @property({ reflect: true }) value = '';
  @property({ reflect: true }) placeholder = '';
  @property({ type: Boolean, reflect: true }) debounceOnChange = false;

  @property({ reflect: true }) autocomplete?: AutoCompleteValues;
  @property({ reflect: true }) inputmode?: InputTypeValues;

  @property({ type: Number, reflect: true }) minLength = 0;
  @property({ type: Number, reflect: true }) maxLength = 0;

  // True if content has changed or `checkValidity` is called.
  inputValidated = false;

  private debouncedOnChangeHandler?: () => void;

  @property() private validationError = '';

  private get inputEl(): HTMLInputElement {
    return this.unsafeGetShadowElement(inputID);
  }

  override firstUpdated() {
    if (this.debounceOnChange) {
      this.debouncedOnChangeHandler = debounceFn(500, this.onChangeDebounced);
    }
  }

  override render() {
    const { inputValidated } = this;
    const validationError = inputValidated ? this.validationError : '';
    return html`
      ${this.label ? html`<label class="app-form-label" for=${inputID}>${this.label}</label>` : ''}
      <input
        class=${inputValidated ? 'validated' : ''}
        id=${inputID}
        ?required=${this.required}
        type=${this.type}
        value=${this.value}
        autocomplete=${ifDefined(this.autocomplete)}
        inputmode=${ifDefined(this.inputmode)}
        placeholder=${this.placeholder}
        @input=${this.handleInput} />
      ${validationError
        ? html`<input-error-view class="m-t-sm" message=${validationError}></input-error-view>`
        : ''}
    `;
  }

  override focus() {
    this.inputEl.focus();
  }

  checkValidity(): boolean {
    this.inputValidated = true;
    const res = this.inputEl.checkValidity();
    this.validationError = this.inputEl.validationMessage;
    if (!this.validationError) {
      try {
        if (this.minLength && this.value.length < this.minLength) {
          throw new Error(formatLS(ls.pFieldMinLenError, this.label, this.minLength));
        }
        if (this.maxLength && this.value.length > this.maxLength) {
          throw new Error(formatLS(ls.pFieldMaxLenError, this.label, this.maxLength));
        }
      } catch (err) {
        ERR(err);
        this.validationError = err.message;
        return false;
      }
    }
    return res;
  }

  private handleInput(_: Event) {
    this.inputValidated = true;
    this.validationError = this.inputEl.validationMessage;
    this.dispatchEvent(
      new CustomEvent<string>('input-change', {
        detail: this.inputEl.value,
      }),
    );
    if (this.debouncedOnChangeHandler) {
      this.debouncedOnChangeHandler();
    }
  }

  // Do not call this directly.
  private onChangeDebounced() {
    this.dispatchEvent(new CustomEvent<undefined>('input-change-debounced'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'input-view': InputView;
  }
}
