/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, TemplateResult, property } from 'll';

export interface SelectViewChangeArgs {
  index: number;
  value: string;
}

@customElement('select-view')
export class SelectView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        select {
          display: block;
          max-width: 100%;
          width: 100%;
          line-height: 1.5;
          background-color: transparent;
          color: var(--app-default-fore-color);
          border: 1px solid var(--app-default-separator-color);
          padding: 0.5rem 3.5rem 0.5rem 1rem;
          border-radius: var(--app-surface-radius-sm);
          appearance: none;

          background-image: linear-gradient(45deg, transparent 50%, gray 50%),
            linear-gradient(135deg, gray 50%, transparent 50%),
            linear-gradient(to right, #ccc, #ccc);
          background-position: calc(100% - 20px) calc(1rem + 2px),
            calc(100% - 15px) calc(1rem + 2px), calc(100% - 2.5rem) 0.5rem;
          background-size: 5px 5px, 5px 5px, 1px 1.5em;
          background-repeat: no-repeat;
        }
      `,
    ];
  }

  @property({ type: Array }) dataSource: ReadonlyArray<string> = [];

  private get selectEl() {
    return this.getShadowElement<HTMLSelectElement>('select');
  }

  override render() {
    return html`
      <select @change=${this.handleChange}>
        ${this.dataSource.map((val) => this.renderItem(val))}
      </select>
    `;
  }

  private renderItem(val: string): TemplateResult {
    return html` <option>${val}</option> `;
  }

  private handleChange() {
    if (!this.selectEl) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent<SelectViewChangeArgs>('select-change', {
        detail: { index: this.selectEl.selectedIndex, value: this.selectEl.value },
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'select-view': SelectView;
  }
}
