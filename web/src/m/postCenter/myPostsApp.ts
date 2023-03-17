/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, TemplateResult } from 'll.js';
import PaginatedList from 'lib/api/paginatedList.js';
import 'ui/content/headingView.js';
import Loader from 'lib/loader.js';
import { appdef } from '@qing/def';
import { PCListApp } from './views/pcListApp.js';
import { GetPCPostsLoader } from './loaders/getPCPostsLoader.js';
import { runNewEntityCommand } from 'app/appCommands.js';
import PCPost from './pcPost.js';

@customElement('my-posts-app')
export default class MyPostsApp extends PCListApp {
  static override get styles() {
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
      appdef.ContentBaseType.post,
      page,
      pageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  sectionHeader(): TemplateResult {
    return html`
      <heading-view>
        <div>${globalThis.coreLS.yourPosts}</div>
        <div slot="decorator">
          <qing-button btnStyle="success" @click=${this.handleNewPostClick}
            >${globalThis.coreLS.newPost}</qing-button
          >
        </div>
      </heading-view>
    `;
  }

  renderTable(): TemplateResult | null {
    return html`
      <thead>
        <th>${globalThis.coreLS.title}</th>
        ${this.renderSortableColumn(appdef.keyCreated, globalThis.coreLS.dateCreated)}
        ${this.renderSortableColumn(appdef.keyComments, globalThis.coreLS.comments)}
        ${this.renderSortableColumn(appdef.keyLikes, globalThis.coreLS.likes)}
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
    runNewEntityCommand(appdef.ContentBaseType.post, null);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-posts-app': MyPostsApp;
  }
}
