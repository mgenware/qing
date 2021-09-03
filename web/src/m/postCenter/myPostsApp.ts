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
import { columnCreated, columnLikes, columnComments, entityPost } from 'sharedConstants';
import { PCListApp } from './views/pcListApp';
import { GetPCPostsLoader, PCPost } from './loaders/getPCPostsLoader';
import { runNewEntityCommand } from 'app/appCommands';

@customElement('my-posts-app')
export default class MyPostsApp extends PCListApp<PCPost> {
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
      entityPost,
      page,
      pageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  sectionHeader(): TemplateResult {
    return html`
      <div class="row align-items-center">
        <div class="col">${ls.yourPosts}</div>
        <div class="col-auto">
          <qing-button btnStyle="success" @click=${this.handleNewPostClick}
            >${ls.newPost}</qing-button
          >
        </div>
      </div>
    `;
  }

  renderTable(): TemplateResult | null {
    return html`
      <thead>
        <th>${ls.title}</th>
        ${this.renderSortableColumn(columnCreated, ls.dateCreated)}
        ${this.renderSortableColumn(columnComments, ls.comments)}
        ${this.renderSortableColumn(columnLikes, ls.likes)}
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
              <td>${item.cmtCount || 0}</td>
              <td>${item.likes || 0}</td>
            </tr>
          `,
        )}
      </tbody>
    `;
  }

  defaultOrderingForColumn(_: string): boolean {
    return true;
  }

  private handleNewPostClick() {
    runNewEntityCommand(entityPost);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-posts-app': MyPostsApp;
  }
}
