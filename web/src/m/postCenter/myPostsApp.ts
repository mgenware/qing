/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, TemplateResult } from 'll';
import ls from 'ls';
import PaginatedList from 'lib/api/paginatedList';
import 'ui/content/headingView';
import Loader from 'lib/loader';
import { appdef } from '@qing/def';
import { PCListApp } from './views/pcListApp';
import { GetPCPostsLoader } from './loaders/getPCPostsLoader';
import { runNewEntityCommand } from 'app/appCommands';
import PCPost from './pcPost';

@customElement('my-posts-app')
export default class MyPostsApp extends PCListApp {
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
      appdef.contentBaseTypePost,
      page,
      pageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  sectionHeader(): TemplateResult {
    return html`
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

  renderTable(): TemplateResult | null {
    return html`
      <thead>
        <th>${ls.title}</th>
        ${this.renderSortableColumn(appdef.keyCreated, ls.dateCreated)}
        ${this.renderSortableColumn(appdef.keyComments, ls.comments)}
        ${this.renderSortableColumn(appdef.keyLikes, ls.likes)}
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
    runNewEntityCommand(appdef.contentBaseTypePost, null);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-posts-app': MyPostsApp;
  }
}
