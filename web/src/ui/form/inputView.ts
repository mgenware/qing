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
          margin-bottom: 0.8rem;
          line-height: 1.5;
          padding: 0.25rem 0.4rem;
          background-color: transparent;
          color: var(--default-fore-color);
          border: 1px solid var(--default-separator-color);
          padding: 0.35rem 0.6rem;
          border-radius: 5px;
        }

        input:invalid {
          border-color: var(--danger-fore-color);
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
  @lp.bool showInputError = false;
  private debouncedOnChangeHandler?: () => void;

  @lp.string private validationMessage = '';
  private inputElement!: HTMLInputElement;

  firstUpdated() {
    this.inputElement = this.mustGetShadowElement(inputID);
    if (this.debounceOnChange) {
      this.debouncedOnChangeHandler = debounceFn(this.onChangeDebounced, { wait: 500 });
    }
  }

  render() {
    const { showInputError } = this;
    return html`
      ${this.label ? html`<label class="app-form-label" for=${inputID}>${this.label}</label>` : ''}
      <input
        id=${inputID}
        ?required=${this.required}
        type=${this.type}
        value=${this.value}
        placeholder=${this.placeholder}
        @input=${this.handleInput}
        style=${showInputError ? '' : 'margin-bottom: 0'}
      />
      ${showInputError
        ? html`<input-error-view message=${this.validationMessage}></input-error-view>`
        : ''}
    `;
  }

  focus() {
    this.inputElement.focus();
  }

  checkValidity(): boolean {
    const res = this.inputElement.checkValidity();
    this.validationMessage = this.inputElement.validationMessage;
    return res;
  }

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.validationMessage = input.validationMessage;
    this.dispatchEvent(
      new CustomEvent<string>('onChange', {
        detail: input.value,
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
