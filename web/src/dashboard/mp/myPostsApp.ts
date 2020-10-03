import { html, customElement, TemplateResult } from 'lit-element';
import ls from 'ls';
import app from 'app';
import PaginatedList from 'lib/api/paginatedList';
import { MPListView } from './views/mpListView';
import { GetMyPostsLoader, DashboardPost } from './loaders/getMyPostsLoader';

@customElement('my-posts-app')
export default class MyPostsApp extends MPListView<DashboardPost> {
  async loadItems(page: number, pageSize: number): Promise<PaginatedList<DashboardPost> | null> {
    const loader = new GetMyPostsLoader(page, pageSize);
    const res = await app.runLocalActionAsync(loader, (st) => (this.loadingStatus = st));
    return res?.data || null;
  }

  sectionTitle(): string {
    return ls.yourPosts;
  }

  renderTable(): TemplateResult | null {
    return html`
      <thead>
        <th>${ls.title}</th>
        <th>${ls.dateCreated}</th>
        <th>${ls.comments}</th>
        <th>${ls.likes}</th>
      </thead>
      <tbody>
        ${this.items.map(
          (item) => html`
            <tr>
              <td style="width: 100%">${item.title}</td>
              <td>
                <time-field
                  .createdAt=${item.createdAt}
                  .modifiedAt=${item.modifiedAt}
                ></time-field>
              </td>
              <td>${item.cmtCount}</td>
              <td>${item.likes}</td>
            </tr>
          `,
        )}
      </tbody>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-posts-app': MyPostsApp;
  }
}
