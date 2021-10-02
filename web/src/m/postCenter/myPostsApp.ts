/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import ls from 'ls';
import PaginatedList from 'lib/api/paginatedList';
import 'ui/content/headingView';
import Loader from 'lib/loader';
import { columnCreated, columnLikes, columnComments, entityPost } from 'sharedConstants';
import { PCListApp } from './views/pcListApp';
import { GetPCPostsLoader } from './loaders/getPCPostsLoader';
import { runNewEntityCommand } from 'app/appCommands';
import PCPost from './pcPost';

@ll.customElement('my-posts-app')
export default class MyPostsApp extends PCListApp {
  static get styles() {
    return [
      super.styles,
      ll.css`
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

  sectionHeader(): ll.TemplateResult {
    return ll.html`
      <heading-view>
        <div>${ls.yourPosts}</div>
        <div slot="decorator">
          <qing-button btnStyle="success" @click=${this.handleNewPostClick}
            >${ls.newPost}</qing-button
          >
        </div>
      </heading-view>
    `;
  }

  renderTable(): ll.TemplateResult | null {
    return ll.html`
      <thead>
        <th>${ls.title}</th>
        ${this.renderSortableColumn(columnCreated, ls.dateCreated)}
        ${this.renderSortableColumn(columnComments, ls.comments)}
        ${this.renderSortableColumn(columnLikes, ls.likes)}
      </thead>
      <tbody>
        ${this.items.map(
          (item) => ll.html`
            <tr>
              <td style="width: 100%"><a href=${item.url}>${item.title}</a></td>
              <td>
                <time-field
                  .createdAt=${item.createdAt}
                  .modifiedAt=${item.modifiedAt}></time-field>
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
    runNewEntityCommand(entityPost, null);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-posts-app': MyPostsApp;
  }
}
