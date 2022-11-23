/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property, when } from 'll';

export interface CardSelectorItem {
  title: string;
  value?: unknown;
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
        }
      `,
    ];
  }

  @property({ type: Number }) selectedIndex = -1;
  @property({ type: Array }) items = [];

  override render() {
    return html` <div class="root">${this.items.map((opt, i) => this.renderItem(opt, i))}</div> `;
  }

  private renderItem(opt: CardSelectorItem, idx: number) {
    return html`
      <a
        class=${`opt ${idx === this.selectedIndex ? 'active' : ''}`}
        @click=${() => this.handleOptClick(opt, idx)}>
        ${when(opt.icon, () => html`<img src=${opt.icon} width="32" height="32" />`)}
        <h2>${opt.title}</h2>
        ${when(opt.desc, () => html`<p>${opt.desc}</p>`)}
      </a>
    `;
  }

  private handleOptClick(opt: CardSelectorItem, idx: number) {
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
