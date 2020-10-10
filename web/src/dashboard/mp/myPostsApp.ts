import { html, customElement, TemplateResult, css } from 'lit-element';
import ls from 'ls';
import routes from 'routes';
import 'ui/cm/timeField';
import PaginatedList from 'lib/api/paginatedList';
import Loader from 'lib/loader';
import { columnCreated, columnLikes, columnComments } from 'app/shared_const.json';
import { MPListApp } from './views/mpListApp';
import { GetMyPostsLoader, DashboardPost } from './loaders/getMyPostsLoader';

@customElement('my-posts-app')
export default class MyPostsApp extends MPListApp<DashboardPost> {
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

  getLoader(page: number, pageSize: number): Loader<PaginatedList<DashboardPost> | null> {
    return new GetMyPostsLoader(
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
          <qing-button btnStyle="success" href=${routes.home.newPost}>${ls.newPost}</qing-button>
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
}

declare global {
  interface HTMLElementTagNameMap {
    'my-posts-app': MyPostsApp;
  }
}
