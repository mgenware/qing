/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import 'ui/lists/itemCounter';
import 'ui/buttons/linkButton';
import { ERR } from 'checks';
import appAlert from 'app/appAlert';
import strf from 'bowhead-js';

const pageInputID = 'page-input';

@customElement('pc-page-control')
export class PCPageControl extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 0.8rem;
        }

        @media (min-width: 768px) {
          .root {
            grid-template-columns: 1fr auto;
            grid-gap: 1rem;
          }
        }
      `,
    ];
  }

  @property({ type: Number }) shownItemCount = 0;
  @property({ type: Number }) totalItemCount = 0;
  @property({ type: Number }) page = 0;
  @property({ type: Number }) pageSize = 0;
  @property() pageInputString = '';

  private get totalPages(): number {
    const { pageSize, totalItemCount } = this;
    return pageSize ? Math.floor((totalItemCount + pageSize - 1) / pageSize) : 0;
  }

  private get pageInputElement(): HTMLInputElement | null {
    return this.getShadowElement(pageInputID);
  }

  override render() {
    const { page, totalPages } = this;
    return html`
      <div class="root">
        <div>
          ${strf(globalThis.coreLS.pageControlItemFormat, this.shownItemCount, this.totalItemCount)}
        </div>
        <div>
          ${strf(globalThis.coreLS.pageControlPageFormat, page, totalPages)}
          <span class="m-l-sm">|</span>
          <input
            id=${pageInputID}
            class="app-inline-text-input m-l-sm"
            type="text"
            size="3"
            value=${this.pageInputString}
            @change=${this.handlePageInput} />
          <link-button @click=${this.handleGotoClick} class="m-l-sm"
            >${globalThis.coreLS.goToPage}</link-button
          >
          <span class="m-l-sm">|</span>
          <link-button
            @click=${() => this.handlePageButtonClick(-1)}
            class="m-l-sm"
            .disabled=${page === 1}
            >${globalThis.coreLS.previousPage}</link-button
          >
          <link-button
            @click=${() => this.handlePageButtonClick(1)}
            class="m-l-sm"
            .disabled=${page === totalPages}
            >${globalThis.coreLS.nextPage}</link-button
          >
        </div>
      </div>
    `;
  }

  private handlePageInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const { value } = input;
    this.pageInputString = value;
  }

  private async handleGotoClick() {
    try {
      const page = parseInt(this.pageInputString, 10);
      if (!page) {
        throw new Error(globalThis.coreLS.invalidPageNumber);
      }
      if (page <= 0 || page > this.totalPages) {
        throw new Error(globalThis.coreLS.pageNumberOutOfBounds);
      }
      this.onGotoPage(page);
    } catch (err) {
      ERR(err);
      await appAlert.error(err.message);
      this.pageInputElement?.select();
    }
  }

  private handlePageButtonClick(offset: number) {
    this.onGotoPage(this.page + offset);
  }

  private onGotoPage(page: number) {
    this.dispatchEvent(
      new CustomEvent<number>('pc-page-goto', {
        detail: page,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pc-page-control': PCPageControl;
  }
}
