import { html, TemplateResult } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/cm/statusView';
import LoadingStatus from 'lib/loadingStatus';
import PaginatedList from 'lib/api/paginatedList';
import './mpPageControl';

const defaultPageSize = 10;

export abstract class MPListView<T> extends BaseElement {
  @lp.object loadingStatus = LoadingStatus.working;
  @lp.array items: T[] = [];

  @lp.number private totalCount = 0;
  @lp.number private shownCount = 0;

  private currentPage = 1;
  private currentPageSize = defaultPageSize;

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
      <div class="section is-info">${this.sectionTitle()}</div>
      <table>
        ${this.renderTable()}
      </table>
      <hr />
      <mp-page-control .total=${this.totalCount} .shown=${this.shownCount}></mp-page-control>
    `;
  }

  firstUpdated() {
    this.startLoading(1, defaultPageSize);
  }

  abstract sectionTitle(): string;
  abstract renderTable(): TemplateResult | null;
  abstract async loadItems(page: number, pageSize: number): Promise<PaginatedList<T> | null>;

  async startLoading(page: number, pageSize: number): Promise<void> {
    this.currentPage = page;
    this.currentPageSize = pageSize;
    const paginatedList = await this.loadItems(page, pageSize);
    if (paginatedList) {
      this.items = paginatedList.items;
      this.totalCount = paginatedList.totalCount;
      this.shownCount = pageSize;
    }
  }

  private async handleRetry() {
    await this.startLoading(this.currentPage, this.currentPageSize);
  }
}
