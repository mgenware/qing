import { html, TemplateResult, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/cm/statusView';
import 'ui/cm/sectionView';
import LoadingStatus from 'lib/loadingStatus';
import PaginatedList from 'lib/api/paginatedList';
import './mpPageControl';

const defaultPageSize = 10;

export abstract class MPListView<T> extends BaseElement {
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

  @lp.number private totalCount = 0;
  @lp.number private shownCount = 0;
  @lp.number private page = 1;
  @lp.number private pageSize = defaultPageSize;

  currentSortedColumn = '';
  currentSortedColumnDesc = false;

  render() {
    const { loadingStatus } = this;
    if (loadingStatus.hasError) {
      return html`<status-view
        .status=${loadingStatus}
        canRetry
        @onRetry=${this.handleRetry}
      ></status-view>`;
    }
    return html`
      <section-view type="info">${this.sectionHeader()}</section-view>
      <table class="app-table">
        ${this.renderTable()}
      </table>
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
  abstract async loadItems(page: number, pageSize: number): Promise<PaginatedList<T> | null>;

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

    const paginatedList = await this.loadItems(page, pageSize);
    if (paginatedList) {
      this.items = paginatedList.items;
      this.totalCount = paginatedList.totalCount;
      this.shownCount = pageSize;
    }
  }

  renderSortableColumn(name: string) {
    const content =
      this.currentSortedColumn === name
        ? html`${name}&nbsp;${this.currentSortedColumnDesc ? '▼' : '▲'}`
        : html`${name}`;
    return html`<th class="sortable-th">${content}</th>`;
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
