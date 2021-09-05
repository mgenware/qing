/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, TemplateResult, css } from 'll';
import ls from 'ls';
import PaginatedList from 'lib/api/paginatedList';
import Loader from 'lib/loader';
import { columnCreated, columnMessages, entityQuestion } from 'sharedConstants';
import { PCListApp } from './views/pcListApp';
import { GetPCPostsLoader } from './loaders/getPCPostsLoader';
import PCPost from './pcPost';
import { runNewEntityCommand } from 'app/appCommands';

@customElement('my-questions-app')
export default class MyQuestionsApp extends PCListApp {
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

  getLoader(page: number, pageSize: number): Loader<PaginatedList<PCPost> | null> {
    return new GetPCPostsLoader(
      entityQuestion,
      page,
      pageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  sectionHeader(): TemplateResult {
    return html`
      <heading-view>
        <div>${ls.yourQuestions}</div>
        <div slot="decorator">
          <qing-button btnStyle="success" @click=${this.handleNewQuestionClick}
            >${ls.newQuestion}</qing-button
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
        ${this.renderSortableColumn(columnMessages, ls.answers)}
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

  private handleNewQuestionClick() {
    runNewEntityCommand(entityQuestion, null);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-questions-app': MyQuestionsApp;
  }
}
