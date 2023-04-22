/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable arrow-body-style */
import { BaseElement, customElement, html, css, TemplateResult, property } from 'll.js';
import './checkBox';

const parentContainerID = 'parent-container';
const itemContainerID = 'item-container';

export interface ChecklistItem {
  key: number;
  text: string;
}

export class ChecklistChangeArgs {
  #rawSelectedItems: readonly unknown[];
  constructor(rawSelectedItems: readonly unknown[]) {
    this.#rawSelectedItems = rawSelectedItems;
  }

  getSelectedItems<T>(): readonly T[] {
    return this.#rawSelectedItems as T[];
  }

  getSelectedItem<T>(): T {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.getSelectedItems<T>()[0]!;
  }
}

@customElement('checklist-view')
export class ChecklistView extends BaseElement {
  static override get styles() {
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

  @property({ type: Array }) items: ReadonlyArray<ChecklistItem> = [];
  @property({ type: Boolean }) multiSelect = false;
  @property({ type: Array }) selectedItems: ReadonlyArray<number> = [];

  // Gets updated whenever `selectedItems` changes.
  private selectedIndexSet = new Set<number>();

  override render() {
    return html`
      <div class="root" part=${parentContainerID}>
        ${this.items.map((e) =>
          this.renderCheckBox(e, this.selectedIndexSet.has(e.key), !this.multiSelect),
        )}
      </div>
    `;
  }

  override willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('selectedItems')) {
      this.selectedIndexSet = new Set(this.selectedItems);
    }
  }

  private renderCheckBox(item: ChecklistItem, checked: boolean, radio: boolean): TemplateResult {
    return html`
      <check-box
        part=${itemContainerID}
        .checked=${checked}
        ?radio=${radio}
        @checkbox-change=${(e: CustomEvent<boolean>) => this.handleOnChange(e, item)}
        >${item.text}</check-box
      >
    `;
  }

  private handleOnChange(e: CustomEvent<boolean>, item: ChecklistItem) {
    const checked = e.detail;
    let selectedItems: number[];
    if (this.multiSelect) {
      if (checked) {
        selectedItems = [...this.selectedItems, item.key];
      } else {
        selectedItems = this.selectedItems.filter((v) => v !== item.key);
      }
    } else {
      selectedItems = checked ? [item.key] : [];
    }
    this.selectedItems = selectedItems;
    this.dispatchEvent(
      new CustomEvent<ChecklistChangeArgs>('checklist-change', {
        detail: new ChecklistChangeArgs(this.selectedItems),
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'checklist-view': ChecklistView;
  }
}
