import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import debounceFn from 'debounce-fn';
import './inputErrorView';

const inputID = 'input-id';

export type InputType =
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

@customElement('input-view')
// Text input view (block). Use `app-inline-text-input` in `app.css` for inline inputs.
export class InputView extends BaseElement {
  static get styles() {
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
          border-width: 2px;
        }

        input:invalid {
          border-color: var(--app-danger-fore-color);
        }
      `,
    ];
  }

  @lp.string label = '';
  @lp.bool required = false;
  @lp.string type: InputType = 'text';
  @lp.string value = '';
  @lp.string placeholder = '';
  @lp.bool debounceOnChange = false;
  private debouncedOnChangeHandler?: () => void;

  @lp.string private validationError = '';

  private get inputElement(): HTMLInputElement {
    return this.mustGetShadowElement(inputID);
  }

  firstUpdated() {
    if (this.debounceOnChange) {
      this.debouncedOnChangeHandler = debounceFn(this.onChangeDebounced, { wait: 500 });
    }
  }

  render() {
    const { validationError } = this;
    return html`
      ${this.label ? html`<label class="app-form-label" for=${inputID}>${this.label}</label>` : ''}
      <input
        id=${inputID}
        ?required=${this.required}
        type=${this.type}
        value=${this.value}
        placeholder=${this.placeholder}
        @input=${this.handleInput}
        style=${`margin-bottom: ${validationError ? '0.5rem' : '0'}`}
      />
      ${validationError
        ? html`<input-error-view message=${validationError}></input-error-view>`
        : ''}
    `;
  }

  focus() {
    this.inputElement.focus();
  }

  checkValidity(): boolean {
    const res = this.inputElement.checkValidity();
    this.validationError = this.inputElement.validationMessage;
    return res;
  }

  private handleInput(_: Event) {
    this.validationError = this.inputElement.validationMessage;
    this.dispatchEvent(
      new CustomEvent<string>('onChange', {
        detail: this.inputElement.value,
      }),
    );
    if (this.debouncedOnChangeHandler) {
      this.debouncedOnChangeHandler();
    }
  }

  // Do not call this directly.
  private onChangeDebounced() {
    this.dispatchEvent(new CustomEvent<undefined>('onChangeDebounced'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'input-view': InputView;
  }
}
