import { html, customElement, TemplateResult, css } from 'lit-element';
import ls from 'ls';
import routes from 'routes';
import 'ui/content/timeField';
import PaginatedList from 'lib/api/paginatedList';
import Loader from 'lib/loader';
import { columnCreated, entityDiscussion, columnMessages } from 'sharedConstants';
import { MPListApp } from './views/mpListApp';
import { GetMyPostsLoader, DashboardDiscussion } from './loaders/getMyPostsLoader';

@customElement('my-discussions-app')
export default class MyDiscussionsApp extends MPListApp<DashboardDiscussion> {
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

  getLoader(page: number, pageSize: number): Loader<PaginatedList<DashboardDiscussion> | null> {
    return new GetMyPostsLoader(
      entityDiscussion,
      page,
      pageSize,
      this.currentSortedColumn,
      this.currentSortedColumnDesc,
    );
  }

  sectionHeader(): TemplateResult {
    return html`
      <div class="row align-items-center">
        <div class="col">${ls.yourDiscussions}</div>
        <div class="col-auto">
          <qing-button btnStyle="success" href=${routes.home.newDiscussion}
            >${ls.newDiscussion}</qing-button
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
}

declare global {
  interface HTMLElementTagNameMap {
    'my-discussion-app': MyDiscussionsApp;
  }
}
