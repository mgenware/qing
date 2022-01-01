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

  @lp.array dataSource: ReadonlyArray<string> = [];
  @lp.bool multiSelect = false;
  @lp.array selectedIndices: ReadonlyArray<number> = [];

  // Gets updated whenever `selectedIndices` changes.
  private selectedIndexSet = new Set<number>();

  render() {
    return html`
      <div class="root" part=${parentContainerID}>
        ${this.dataSource.map((val, index) =>
          this.renderCheckBox(val, this.selectedIndexSet.has(index), index, !this.multiSelect),
        )}
      </div>
    `;
  }

  override willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('selectedIndices')) {
      this.selectedIndexSet = new Set(this.selectedIndices);
    }
  }

  private renderCheckBox(
    val: string,
    checked: boolean,
    index: number,
    radio: boolean,
  ): TemplateResult {
    return html`
      <check-box
        part=${itemContainerID}
        .checked=${checked}
        ?radio=${radio}
        @checked=${(e: CustomEvent<boolean>) => this.handleOnChange(e, index)}
        >${val}</check-box
      >
    `;
  }

  private handleOnChange(e: CustomEvent<boolean>, index: number) {
    const checked = e.detail;
    let indices: number[];
    if (this.multiSelect) {
      if (checked) {
        indices = [...this.selectedIndices, index];
      } else {
        indices = this.selectedIndices.filter((v) => v !== index);
      }
    } else {
      indices = checked ? [index] : [];
    }
    this.dispatchEvent(new CustomEvent<number[]>('selectionChanged', { detail: indices }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'checklist-view': ChecklistView;
  }
}
