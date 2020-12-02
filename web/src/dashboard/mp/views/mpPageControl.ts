import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/com/itemCounter';
import 'ui/com/linkButton';
import ls, { formatLS } from 'ls';
import app from 'app';

const pageInputID = 'page-input';

@customElement('mp-page-control')
export class MPPageControl extends BaseElement {
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

  @lp.number shownItemCount = 0;
  @lp.number totalItemCount = 0;
  @lp.number page = 0;
  @lp.number pageSize = 0;
  @lp.string pageInputString = '';

  private get totalPages(): number {
    const { pageSize, totalItemCount } = this;
    return pageSize ? Math.floor((totalItemCount + pageSize - 1) / pageSize) : 0;
  }

  private get pageInputElement(): HTMLInputElement {
    return this.mustGetShadowElement(pageInputID);
  }

  render() {
    const { page, totalPages } = this;
    return html`
      <div class="row">
        <div class="col-md-auto">
          ${formatLS(ls.pageControlItemFormat, this.shownItemCount, this.totalItemCount)}
        </div>
        <div class="col"></div>
        <div class="col-md-auto">
          ${formatLS(ls.pageControlPageFormat, page, totalPages)} |
          <input
            id=${pageInputID}
            class="app-inline-text-input"
            type="text"
            size="3"
            value=${this.pageInputString}
            @change=${this.handlePageInput}
          />
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
    } catch (ex) {
      await app.alert.error(ex.message);
      this.pageInputElement.select();
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
    'mp-page-control': MPPageControl;
  }
}
