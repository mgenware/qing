/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property, when } from 'll.js';

export interface CardSelectorItem {
  title: string;
  value?: number;
  icon?: string;
  desc?: string;
}

export interface CardSelectedDetail {
  index: number;
  item: CardSelectorItem;
}

@customElement('card-selector')
export class CardSelector extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }

        .opt {
          border: 2px solid var(--app-default-separator-color);
          display: block;
          padding-left: 1rem;
          padding-right: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .active {
          border: 2px solid var(--app-default-primary-fore-color);
        }
      `,
    ];
  }

  @property({ type: Number }) selectedIndex = -1;
  @property({ type: Number }) selectedValue: number | undefined;
  @property({ type: Array }) items = [];

  override render() {
    return html` <div class="root">${this.items.map((opt, i) => this.renderItem(opt, i))}</div> `;
  }

  private renderItem(opt: CardSelectorItem, idx: number) {
    return html`
      <a
        class=${`opt ${
          idx === this.selectedIndex || opt.value === this.selectedValue ? 'active' : ''
        }`}
        href="#"
        @click=${(e: Event) => this.handleOptClick(e, opt, idx)}>
        <div>
          ${when(opt.icon, () => html`<img src=${opt.icon} width="32" height="32" />`)}
          <h3>${opt.title}</h3>
          ${when(opt.desc, () => html`<p>${opt.desc}</p>`)}
        </div>
      </a>
    `;
  }

  private handleOptClick(e: Event, opt: CardSelectorItem, idx: number) {
    e.preventDefault();
    if (this.selectedIndex === idx) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent<CardSelectedDetail>('card-select', { detail: { index: idx, item: opt } }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'card-selector': CardSelector;
  }
}
