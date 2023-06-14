/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CHECK } from 'checks.js';
import { BaseElement, customElement, html, css, property, styleMap, repeat, classMap } from 'll.js';

export interface CheckListItem {
  // Using unknown here because the key can be a string or number.
  key: unknown;
  text: string;
}

export class CheckListChangeArgs {
  #rawSelectedItems: readonly unknown[];
  constructor(rawSelectedItems: readonly unknown[]) {
    this.#rawSelectedItems = rawSelectedItems;
  }

  selectedItems<T>(): readonly T[] {
    return this.#rawSelectedItems as readonly T[];
  }

  selectedItem<T>(): T {
    const items = this.selectedItems<T>();
    CHECK(items.length === 1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return items[0]!;
  }
}

@customElement('check-item')
export class CheckItem extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .checkmark {
          display: inline-block;
          width: 22px;
          height: 22px;
          transform: rotate(45deg);
        }

        .checkmark_circle {
          position: absolute;
          width: 22px;
          height: 22px;
          border: 1px solid var(--app-default-secondary-fore-color);
          border-radius: 11px;
          left: 0;
          top: 0;
        }

        .checkmark_circle.active {
          background-color: var(--app-default-primary-fore-color);
          border: 1px solid var(--app-default-primary-fore-color);
        }

        .checkmark_stem {
          position: absolute;
          width: 3px;
          height: 9px;
          background-color: var(--app-default-back-color);
          left: 11px;
          top: 6px;
        }

        .checkmark_kick {
          position: absolute;
          width: 3px;
          height: 3px;
          background-color: var(--app-default-back-color);
          left: 8px;
          top: 12px;
        }

        qing-button {
          display: block;
        }

        .content {
          display: grid;
          grid-template-columns: auto 1fr;
          grid-gap: 1rem;
          align-items: center;
          justify-items: start;
        }
      `,
    ];
  }

  @property({ type: Boolean, reflect: true }) checked = false;

  override render() {
    return html`
      <qing-button class="icon" @click=${this.handleCheck}>
        <div class="content">
          <span class="checkmark">
            <div
              class=${classMap({
                checkmark_circle: true,
                active: this.checked,
              })}></div>
            <div
              class="checkmark_stem"
              style=${styleMap({ visibility: this.checked ? 'visible' : 'hidden' })}></div>
            <div
              class="checkmark_kick"
              style=${styleMap({ visibility: this.checked ? 'visible' : 'hidden' })}></div>
          </span>
          <slot></slot>
        </div>
      </qing-button>
    `;
  }

  private handleCheck() {
    // NOTE: this only fires the event, it does not change the state.
    // It's caller's responsibility to change the state.
    this.dispatchEvent(new CustomEvent('check'));
  }
}

@customElement('check-list')
export class CheckList extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root {
          border: 1px solid var(--app-default-separator-color);
          border-radius: var(--app-surface-radius-sm);
        }
      `,
    ];
  }

  @property({ type: Array }) items: readonly CheckListItem[] = [];
  @property({ type: Boolean }) multiSelect = false;
  @property({ type: Array }) selectedItems: readonly unknown[] = [];

  // Gets updated whenever `selectedItems` changes.
  private selectedIndexSet = new Set<unknown>();

  override render() {
    return html`<div class="root">
      ${repeat(
        this.items,
        (e) => e.key,
        (e) => this.renderCheckBox(e, this.selectedIndexSet.has(e.key), !this.multiSelect),
      )}
    </div>`;
  }

  override willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('selectedItems')) {
      this.selectedIndexSet = new Set(this.selectedItems);
    }
  }

  private renderCheckBox(item: CheckListItem, checked: boolean, radio: boolean) {
    return html`
      <check-item .checked=${checked} ?radio=${radio} @check=${() => this.handleItemCheck(item)}
        >${item.text}</check-item
      >
    `;
  }

  private handleItemCheck(item: CheckListItem) {
    const checked = this.selectedIndexSet.has(item.key);
    let selectedItems: unknown[];
    if (this.multiSelect) {
      if (checked) {
        selectedItems = [...this.selectedItems].filter((v) => v !== item.key);
      } else {
        selectedItems = [...this.selectedItems, item.key];
      }
    } else {
      selectedItems = checked ? [] : [item.key];
    }
    this.selectedItems = selectedItems;
    this.dispatchEvent(
      new CustomEvent<CheckListChangeArgs>('checklist-change', {
        detail: new CheckListChangeArgs(this.selectedItems),
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'check-item': CheckItem;
    'check-list': CheckList;
  }
}
