/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, TemplateResult, css } from 'll';
import ls from 'ls';
import PaginatedList from 'lib/api/paginatedList';
import Loader from 'lib/loader';
import { columnCreated, entityDiscussion, columnMessages } from 'sharedConstants';
import { PCListApp } from './views/pcListApp';
import { GetPCPostsLoader, PCDiscussion } from './loaders/getPCPostsLoader';
import { runNewEntityCommand } from 'app/appCommands';

@customElement('my-discussions-app')
export default class MyDiscussionsApp extends PCListApp<PCDiscussion> {
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

  constructor() {
    super();
    this.currentSortedColumn = columnCreated;
    this.currentSortedColumnDesc = true;
  }

  getLoader(page: number, pageSize: number): Loader<PaginatedList<PCDiscussion> | null> {
    return new GetPCPostsLoader(
      entityDiscussion,
      page,
      pageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  sectionHeader(): TemplateResult {
    return html`
      <heading-view>
        <div>${ls.yourDiscussions}</div>
        <div slot="decorator">
          <qing-button btnStyle="success" @click=${this.handleNewDiscussionClick}
            >${ls.newDiscussion}</qing-button
          >
        </div>
      </heading-view>
    `;
  }

  renderTable(): TemplateResult | null {
    return html`
      <thead>
        <th>${ls.title}</th>
        ${this.renderSortableColumn(columnCreated, ls.dateCreated)}
        ${this.renderSortableColumn(columnMessages, ls.msgs)}
      </thead>
      <tbody>
        ${this.items.map(
          (item) => html`
            <tr>
              <td style="width: 100%"><a href=${item.url}>${item.title}</a></td>
              <td>
                <time-field
                  .createdAt=${item.createdAt}
                  .modifiedAt=${item.modifiedAt}
                ></time-field>
              </td>
              <td>${item.msgCount || 0}</td>
            </tr>
          `,
        )}
      </tbody>
    `;
  }

  defaultOrderingForColumn(_: string): boolean {
    return true;
  }

  private handleNewDiscussionClick() {
    runNewEntityCommand(entityDiscussion, null);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-discussion-app': MyDiscussionsApp;
  }
}
