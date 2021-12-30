/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable arrow-body-style */
import { BaseElement, customElement, html, css, TemplateResult } from 'll';
import * as lp from 'lit-props';
import './checkBox';

const parentContainerID = 'parent-container';
const itemContainerID = 'item-container';

export interface ChecklistViewItem {
  text: string;
  value?: unknown;
  checked?: boolean;
}

export interface ChecklistViewItemEvent {
  checked: boolean;
  text: string;
  value: unknown;
  index: number;
}

@customElement('checklist-view')
export class ChecklistView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root {
          display: flex;
          flex-wrap: wrap;
          row-gap: 2rem;
          column-gap: 1rem;
        }
      `,
    ];
  }

  @lp.array dataSource: ChecklistViewItem[] = [];
  @lp.bool multiSelect = false;

  render() {
    return html`
      <div class="root" part=${parentContainerID}>
        ${this.dataSource.map((item, index) => this.renderCheckBox(item, index, !this.multiSelect))}
      </div>
    `;
  }

  private renderCheckBox(item: ChecklistViewItem, index: number, radio: boolean): TemplateResult {
    return html`
      <check-box
        part=${itemContainerID}
        .checked=${!!item.checked}
        ?radio=${radio}
        @change=${(e: Event) => this.handleOnChange(e, item, index)}
        >${item.text}</check-box
      >
    `;
  }

  private handleOnChange(e: Event, item: ChecklistViewItem, index: number) {
    const { checked } = e.target as HTMLInputElement;
    const detail: ChecklistViewItemEvent = {
      text: item.text,
      value: item.value,
      index,
      checked,
    };
    this.dispatchEvent(new CustomEvent<ChecklistViewItemEvent>('onSelectionChange', { detail }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'checklist-view': ChecklistView;
  }
}
