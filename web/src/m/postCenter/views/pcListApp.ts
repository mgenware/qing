/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, html, css, TemplateResult, property } from 'll';
import 'ui/status/statusView';
import 'ui/content/headingView';
import 'ui/alerts/noticeView';
import LoadingStatus from 'lib/loadingStatus';
import PaginatedList from 'lib/api/paginatedList';
import './pcPageControl';
import Loader from 'lib/loader';
import ls from 'ls';
import appTask from 'app/appTask';
import PCPost from '../pcPost';

const defaultPageSize = 10;

export abstract class PCListApp extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .sortable-th {
          cursor: pointer;
        }
      `,
    ];
  }

  @property({ type: Object }) loadingStatus = LoadingStatus.working;
  @property({ type: Array }) items: readonly PCPost[] = [];

  // Set those properties in child classes to have a default sorted column.
  @property() currentSortedColumn = '';
  @property({ type: Boolean }) currentSortedColumnDesc = false;

  @property({ type: Number }) private totalCount = 0;
  @property({ type: Number }) private shownCount = 0;
  @property({ type: Number }) private page = 1;
  @property({ type: Number }) private pageSize = defaultPageSize;

  override render() {
    const { loadingStatus } = this;
    if (!loadingStatus.isSuccess) {
      return html`<status-view
        .progressViewPadding=${'md'}
        .status=${loadingStatus}
        canRetry
        @status-view-retry=${this.handleRetry}></status-view>`;
    }

    const hasItems = !!this.items.length;
    return html`
      <section-view sectionStyle="info">
        <div slot="header">${this.sectionHeader()}</div>
        ${hasItems
          ? html`<div class="app-table-container m-t-md">
              <table class="app-table">
                ${this.renderTable()}
              </table>
            </div>`
          : html`<notice-view>${ls.noContentAvailable}</notice-view>`}
        <hr />
        <pc-page-control
          .page=${this.page}
          .pageSize=${this.pageSize}
          .totalItemCount=${this.totalCount}
          .shownItemCount=${this.shownCount}
          @pc-page-goto=${this.handleGotoPage}></pc-page-control>
      </section-view>
    `;
  }

  override async firstUpdated() {
    await this.startLoading(
      1,
      defaultPageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  abstract sectionHeader(): TemplateResult | null;
  abstract renderTable(): TemplateResult | null;
  abstract getLoader(page: number, pageSize: number): Loader<PaginatedList<PCPost> | null>;
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
    const res = await appTask.local(loader, (st) => (this.loadingStatus = st));
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
