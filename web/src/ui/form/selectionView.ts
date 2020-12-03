/* eslint-disable arrow-body-style */
import { html, customElement, css, TemplateResult } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';

export interface SelectionViewItem {
  text: string;
  value?: unknown;
  selected?: boolean;
}

export interface SelectionViewItemEvent {
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
    const id = `checkbox_idx_${index}`;
    return html`<input
        type="checkbox"
        name="checkbox"
        id=${id}
        ?checked=${item.selected}
        @change=${() => this.handleOnChange(item, index)}
      /><label for=${id}>${item.text}</label>`;
  }

  private renderRadioBox(item: SelectionViewItem, index: number): TemplateResult {
    const id = `radiobox_idx_${index}`;
    return html`<input
        type="radio"
        name="radioBox"
        id=${id}
        ?checked=${item.selected}
        @change=${() => this.handleOnChange(item, index)}
      /><label for=${id}>${item.text}</label>`;
  }

  private handleOnChange(item: SelectionViewItem, index: number) {
    const detail: SelectionViewItemEvent = {
      text: item.text,
      value: item.value,
      index,
    };
    this.dispatchEvent(
      new CustomEvent<SelectionViewItemEvent>('onSelectionChange', { detail }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'selection-view': SelectionView;
  }
}
