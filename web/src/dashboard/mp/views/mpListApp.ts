import { html, TemplateResult, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/cm/statusView';
import 'ui/cm/sectionView';
import 'ui/cm2/noContentView';
import LoadingStatus from 'lib/loadingStatus';
import PaginatedList from 'lib/api/paginatedList';
import './mpPageControl';
import Loader from 'lib/loader';
import app from 'app';

const defaultPageSize = 10;

export abstract class MPListApp<T> extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .sortable-th {
          cursor: pointer;
        }
      `,
    ];
  }

  @lp.object loadingStatus = LoadingStatus.working;
  @lp.array items: T[] = [];

  // Set those properties in child classes to have a default sorted column.
  @lp.string currentSortedColumn = '';
  @lp.bool currentSortedColumnDesc = false;

  @lp.number private totalCount = 0;
  @lp.number private shownCount = 0;
  @lp.number private page = 1;
  @lp.number private pageSize = defaultPageSize;

  render() {
    const { loadingStatus } = this;
    if (loadingStatus.hasError) {
      return html`<status-view
        .status=${loadingStatus}
        canRetry
        @onRetry=${this.handleRetry}
      ></status-view>`;
    }

    const hasItems = !!this.items.length;
    return html`
      <section-view sectionStyle="info">${this.sectionHeader()}</section-view>
      ${hasItems
        ? html`<div class="app-table-container m-t-md">
            <table class="app-table">
              ${this.renderTable()}
            </table>
          </div>`
        : html`<no-content-view></no-content-view>`}
      <hr />
      <mp-page-control
        .page=${this.page}
        .pageSize=${this.pageSize}
        .totalItemCount=${this.totalCount}
        .shownItemCount=${this.shownCount}
        @gotoPage=${this.handleGotoPage}
      ></mp-page-control>
    `;
  }

  firstUpdated() {
    this.startLoading(1, defaultPageSize, this.currentSortedColumn, this.currentSortedColumnDesc);
  }

  abstract sectionHeader(): TemplateResult | null;
  abstract renderTable(): TemplateResult | null;
  abstract getLoader(page: number, pageSize: number): Loader<PaginatedList<T> | null>;
  abstract defaultOrderingForColumn(name: string): boolean;

  async startLoading(
    page: number,
    pageSize: number,
    sortedColumn: string,
    desc: boolean,
  ): Promise<void> {
    if (!sortedColumn) {
      throw new Error('`sortedColumn` is empty');
    }

    // Store loading params locally. When loading failed,
    // those params can be picked up to restart a request.
    this.page = page;
    this.pageSize = pageSize;
    this.currentSortedColumn = sortedColumn;
    this.currentSortedColumnDesc = desc;

    const loader = this.getLoader(page, pageSize);
    const res = await app.runLocalActionAsync(loader, (st) => (this.loadingStatus = st));
    if (res.data) {
      const paginatedList = res.data;
      this.items = paginatedList.items;
      this.totalCount = paginatedList.totalCount;
      this.shownCount = this.items.length;
    }
  }

  renderSortableColumn(key: string, name: string) {
    const content =
      this.currentSortedColumn === key
        ? html`${name}&nbsp;${this.currentSortedColumnDesc ? '▼' : '▲'}`
        : html`${name}`;
    return html`<th class="sortable-th" @click=${() => this.sortColumn(key)}>${content}</th>`;
  }

  private async sortColumn(key: string) {
    // Sorting always goes to first page.
    await this.startLoading(
      1,
      this.pageSize,
      key,
      key === this.currentSortedColumn
        ? !this.currentSortedColumnDesc
        : this.defaultOrderingForColumn(key),
    );
  }

  private async handleRetry() {
    await this.startLoading(
      this.page,
      this.pageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  private async handleGotoPage(e: CustomEvent<number>) {
    await this.startLoading(
      e.detail,
      this.pageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }
}
