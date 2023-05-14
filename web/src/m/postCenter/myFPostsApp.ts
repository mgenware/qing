/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, TemplateResult } from 'll.js';
import PaginatedList from 'lib/api/paginatedList.js';
import Loader from 'lib/loader.js';
import { appDef, frozenDef } from '@qing/def';
import { PCListApp } from './views/pcListApp.js';
import { GetPCPostsLoader } from './loaders/getPCPostsLoader.js';
import PCPost from './pcPost.js';
import { runNewEntityCommand } from 'app/appCommands.js';

@customElement('my-fposts-app')
export default class MyFPostsApp extends PCListApp {
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
    this.currentSortedColumn = appDef.keyCreated;
    this.currentSortedColumnDesc = true;
  }

  getLoader(page: number, pageSize: number): Loader<PaginatedList<PCPost> | null> {
    return new GetPCPostsLoader(
      frozenDef.ContentBaseType.fPost,
      page,
      pageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  sectionHeader(): TemplateResult {
    return html`
      <heading-view>
        <div>${globalThis.coreLS.yourFPosts}</div>
        <div slot="decorator">
          <qing-button btnStyle="success" @click=${this.handleNewFPostClick}
            >${globalThis.coreLS.newFPost}</qing-button
          >
        </div>
      </heading-view>
    `;
  }

  renderTable(): TemplateResult | null {
    return html`
      <thead>
        <th>${globalThis.coreLS.title}</th>
        ${this.renderSortableColumn(appDef.keyCreated, globalThis.coreLS.dateCreated)}
        ${this.renderSortableColumn(appDef.keyMessages, globalThis.coreLS.replies)}
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

  private handleNewFPostClick() {
    runNewEntityCommand(frozenDef.ContentBaseType.fPost, null);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-fposts-app': MyFPostsApp;
  }
}
