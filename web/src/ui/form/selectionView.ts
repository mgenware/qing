/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable arrow-body-style */
import { html, customElement, css, TemplateResult, BaseElement, lp } from 'll';

export interface SelectionViewItem {
  text: string;
  value?: unknown;
  checked?: boolean;
}

export interface SelectionViewItemEvent {
  checked: boolean;
  text: string;
  value: unknown;
  index: number;
}

@customElement('selection-view')
export class SelectionView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        /** Radio-box */
        /** https://dev.to/kallmanation/styling-a-radio-button-with-only-css-4llc
 */
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

        /** Checkbox */
        /** https://www.w3schools.com/howto/howto_css_custom_checkbox.asp
 */
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

  @lp.array dataSource: SelectionViewItem[] = [];
  @lp.bool multiSelect = false;

  render() {
    return html`
      <div>
        ${this.dataSource.map((item, index) => {
          return this.multiSelect
            ? this.renderCheckBox(item, index)
            : this.renderRadioBox(item, index);
        })}
      </div>
    `;
  }

  private renderCheckBox(item: SelectionViewItem, index: number): TemplateResult {
    const name = 'check-box';
    return html`
      <label>
        <input
          type="checkbox"
          .checked=${!!item.checked}
          name=${name}
          @change=${(e: Event) => this.handleOnChange(e, item, index)}
        />
        <span>${item.text}</span>
      </label>
    `;
  }

  private renderRadioBox(item: SelectionViewItem, index: number): TemplateResult {
    // Name is required to make sure each option is mutually exclusive.
    const name = 'radio-box';
    return html`
      <label>
        <input
          type="radio"
          .checked=${!!item.checked}
          name=${name}
          @change=${(e: Event) => this.handleOnChange(e, item, index)}
        />
        <span>${item.text}</span>
      </label>
    `;
  }

  private handleOnChange(e: Event, item: SelectionViewItem, index: number) {
    const { checked } = e.target as HTMLInputElement;
    const detail: SelectionViewItemEvent = {
      text: item.text,
      value: item.value,
      index,
      checked,
    };
    this.dispatchEvent(new CustomEvent<SelectionViewItemEvent>('onSelectionChange', { detail }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'selection-view': SelectionView;
  }
}
