import { html, TemplateResult, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/cm/statusView';
import LoadingStatus from 'lib/loadingStatus';
import PaginatedList from 'lib/api/paginatedList';
import './mpPageControl';

const defaultPageSize = 10;

export abstract class MPListView<T> extends BaseElement {
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

  @lp.object loadingStatus = LoadingStatus.working;
  @lp.array items: T[] = [];

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
    return html`
      <div class="section is-info">${this.sectionTitle()}</div>
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
    this.startLoading(1, defaultPageSize);
  }

  abstract sectionTitle(): string;
  abstract renderTable(): TemplateResult | null;
  abstract async loadItems(page: number, pageSize: number): Promise<PaginatedList<T> | null>;

  async startLoading(page: number, pageSize: number): Promise<void> {
    this.page = page;
    this.pageSize = pageSize;
    const paginatedList = await this.loadItems(page, pageSize);
    if (paginatedList) {
      this.items = paginatedList.items;
      this.totalCount = paginatedList.totalCount;
      this.shownCount = pageSize;
    }
  }

  private async handleRetry() {
    await this.startLoading(this.page, this.pageSize);
  }

  private async handleGotoPage(e: CustomEvent<number>) {
    await this.startLoading(e.detail, this.pageSize);
  }
}
