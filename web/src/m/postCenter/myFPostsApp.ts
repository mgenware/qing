/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, TemplateResult } from 'll';
import PaginatedList from 'lib/api/paginatedList';
import Loader from 'lib/loader';
import { appdef } from '@qing/def';
import { PCListApp } from './views/pcListApp';
import { GetPCPostsLoader } from './loaders/getPCPostsLoader';
import PCPost from './pcPost';
import { runNewEntityCommand } from 'app/appCommands';

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
    this.currentSortedColumn = appdef.keyCreated;
    this.currentSortedColumnDesc = true;
  }

  getLoader(page: number, pageSize: number): Loader<PaginatedList<PCPost> | null> {
    return new GetPCPostsLoader(
      appdef.ContentBaseType.fPost,
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
        ${this.renderSortableColumn(appdef.keyCreated, globalThis.coreLS.dateCreated)}
        ${this.renderSortableColumn(appdef.keyMessages, globalThis.coreLS.replies)}
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
    runNewEntityCommand(appdef.ContentBaseType.fPost, null);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-fposts-app': MyFPostsApp;
  }
}
