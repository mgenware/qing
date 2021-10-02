/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
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

export abstract class PCListApp extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: block;
        }

        .sortable-th {
          cursor: pointer;
        }
      `,
    ];
  }

  @ll.object loadingStatus = LoadingStatus.working;
  @ll.array items: PCPost[] = [];

  // Set those properties in child classes to have a default sorted column.
  @ll.string currentSortedColumn = '';
  @ll.bool currentSortedColumnDesc = false;

  @ll.number private totalCount = 0;
  @ll.number private shownCount = 0;
  @ll.number private page = 1;
  @ll.number private pageSize = defaultPageSize;

  render() {
    const { loadingStatus } = this;
    if (!loadingStatus.isSuccess) {
      return ll.html`<status-view
        .progressViewPadding=${'md'}
        .status=${loadingStatus}
        canRetry
        @onRetry=${this.handleRetry}></status-view>`;
    }

    const hasItems = !!this.items.length;
    return ll.html`
      <section-view sectionStyle="info">
        <div slot="header">${this.sectionHeader()}</div>
        ${
          hasItems
            ? ll.html`<div class="app-table-container m-t-md">
              <table class="app-table">
                ${this.renderTable()}
              </table>
            </div>`
            : ll.html`<notice-view>${ls.noContentAvailable}</notice-view>`
        }
        <hr />
        <pc-page-control
          .page=${this.page}
          .pageSize=${this.pageSize}
          .totalItemCount=${this.totalCount}
          .shownItemCount=${this.shownCount}
          @gotoPage=${this.handleGotoPage}></pc-page-control>
      </section-view>
    `;
  }

  async firstUpdated() {
    await this.startLoading(
      1,
      defaultPageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  abstract sectionHeader(): ll.TemplateResult | null;
  abstract renderTable(): ll.TemplateResult | null;
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
        ? ll.html`${name}&nbsp;${this.currentSortedColumnDesc ? '▼' : '▲'}`
        : ll.html`${name}`;
    return ll.html`<th class="sortable-th" @click=${() => this.sortColumn(key)}>${content}</th>`;
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
