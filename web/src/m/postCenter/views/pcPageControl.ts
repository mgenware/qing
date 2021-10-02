/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import 'ui/lists/itemCounter';
import 'ui/buttons/linkButton';
import { ERR } from 'checks';
import ls, { formatLS } from 'ls';
import appAlert from 'app/appAlert';

const pageInputID = 'page-input';

@ll.customElement('pc-page-control')
export class PCPageControl extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @ll.number shownItemCount = 0;
  @ll.number totalItemCount = 0;
  @ll.number page = 0;
  @ll.number pageSize = 0;
  @ll.string pageInputString = '';

  private get totalPages(): number {
    const { pageSize, totalItemCount } = this;
    return pageSize ? Math.floor((totalItemCount + pageSize - 1) / pageSize) : 0;
  }

  private get pageInputElement(): HTMLInputElement | null {
    return this.getShadowElement(pageInputID);
  }

  render() {
    const { page, totalPages } = this;
    return ll.html`
      <div class="row">
        <div class="col-auto">
          ${formatLS(ls.pageControlItemFormat, this.shownItemCount, this.totalItemCount)}
        </div>
        <div class="col"></div>
        <div class="col-auto">
          ${formatLS(ls.pageControlPageFormat, page, totalPages)} |
          <input
            id=${pageInputID}
            class="app-inline-text-input"
            type="text"
            size="3"
            value=${this.pageInputString}
            @change=${this.handlePageInput} />
          <link-button @click=${this.handleGotoClick}>${ls.goToPage}</link-button> |
          <link-button @click=${() => this.handlePageButtonClick(-1)} .disabled=${page === 1}
            >${ls.previousPage}</link-button
          >
          <link-button
            @click=${() => this.handlePageButtonClick(1)}
            .disabled=${page === totalPages}
            >${ls.nextPage}</link-button
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
        throw new Error(ls.invalidPageNumber);
      }
      if (page <= 0 || page > this.totalPages) {
        throw new Error(ls.pageNumberOutOfBounds);
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
      new CustomEvent<number>('gotoPage', {
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
