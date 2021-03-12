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

  @lp.string label = '';
  @lp.bool required = false;
  @lp.string type: InputType = 'text';
  @lp.string value = '';
  @lp.string placeholder = '';
  @lp.bool debounceOnChange = false;

  // True if content has changed or `checkValidity` is called.
  inputValidated = false;

  private debouncedOnChangeHandler?: () => void;

  @lp.string private validationError = '';

  private get inputEl(): HTMLInputElement {
    return this.unsafeGetShadowElement(inputID);
  }

  firstUpdated() {
    if (this.debounceOnChange) {
      this.debouncedOnChangeHandler = debounceFn(this.onChangeDebounced, { wait: 500 });
    }
  }

  render() {
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
    this.inputEl.focus();
  }

  checkValidity(): boolean {
    this.inputValidated = true;
    const res = this.inputEl.checkValidity();
    this.validationError = this.inputEl.validationMessage;
    return res;
  }

  private handleInput(_: Event) {
    this.inputValidated = true;
    this.validationError = this.inputEl.validationMessage;
    this.dispatchEvent(
      new CustomEvent<string>('onChange', {
        detail: this.inputEl.value,
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
