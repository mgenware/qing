/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, TemplateResult } from 'll';
import ls from 'ls';
import PaginatedList from 'lib/api/paginatedList';
import Loader from 'lib/loader';
import { appdef } from '@qing/def';
import { PCListApp } from './views/pcListApp';
import { GetPCPostsLoader } from './loaders/getPCPostsLoader';
import PCPost from './pcPost';
import { runNewEntityCommand } from 'app/appCommands';

@customElement('my-threads-app')
export default class MyThreadsApp extends PCListApp {
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
    this.currentSortedColumn = appdef.keyCreated;
    this.currentSortedColumnDesc = true;
  }

  getLoader(page: number, pageSize: number): Loader<PaginatedList<PCPost> | null> {
    return new GetPCPostsLoader(
      appdef.contentBaseTypeThread,
      page,
      pageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  sectionHeader(): TemplateResult {
    return html`
      <heading-view>
        <div>${ls.yourThreads}</div>
        <div slot="decorator">
          <qing-button btnStyle="success" @click=${this.handleNewQuestionClick}
            >${ls.newThread}</qing-button
          >
        </div>
      </heading-view>
    `;
  }

  renderTable(): TemplateResult | null {
    return html`
      <thead>
        <th>${ls.title}</th>
        ${this.renderSortableColumn(appdef.keyCreated, ls.dateCreated)}
        ${this.renderSortableColumn(appdef.keyMessages, ls.replies)}
      </thead>
      <tbody>
        ${this.items.map(
          (item) => html`
            <tr>
              <td style="width: 100%"><a href=${item.url}>${item.title}</a></td>
              <td>
                <time-field
                  .createdAt=${item.createdAt}
                  .modifiedAt=${item.modifiedAt}></time-field>
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

  private handleNewQuestionClick() {
    runNewEntityCommand(appdef.contentBaseTypeThread, null);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-threads-app': MyThreadsApp;
  }
}
