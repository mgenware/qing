import { html, customElement, property } from 'lit-element';
import ls from '../ls';
import BaseElement from '../baseElement';
import page from 'page';
import rs from 'routes';
import 'post/setPostApp';
import './settings/profile/editProfileApp';

class Page {
  constructor(public content: any, public showSidebar: boolean) {}
}

@customElement('dashboard-app')
export default class DashboardApp extends BaseElement {
  @property({ type: Object }) content: Page | null = null;

  firstUpdated() {
    page(rs.dashboard.newPost, () => {
      this.content = new Page(
        html`
          <div class="m-md">
            <set-post-app></set-post-app>
          </div>
        `,
        false,
      );
    });
    page(`${rs.dashboard.editPost}/:id`, e => {
      const id = e.params.id;
      if (!id) {
        return;
      }
      this.content = new Page(
        html`
          <div class="m-md">
            <set-post-app .editedID=${id}></set-post-app>
          </div>
        `,
        false,
      );
    });
    page(rs.dashboard.editProfile, () => {
      this.content = new Page(
        html`
          <div class="m-md">
            <edit-profile-app></edit-profile-app>
          </div>
        `,
        true,
      );
    });
    page();
  }

  render() {
    const { content } = this;
    if (!content) {
      return html`
        <p>No content</p>
      `;
    }
    if (!content.showSidebar) {
      return content.content;
    }
    return html`
      <div class="container">
        <div class="row">
          <div class="col-md-auto">
            <aside>
              <p class="menu-label">${ls.common}</p>
              <ul class="menu-list">
                <li>
                  <a href=${rs.dashboard.newPost}>${ls.newPost}</a>
                </li>
              </ul>
              <p class="menu-label">${ls.settings}</p>
              <ul class="menu-list">
                <li>
                  <a href=${rs.dashboard.editProfile}>${ls.profile}</a>
                </li>
              </ul>
            </aside>
          </div>
          <div class="col-md">${content.content}</div>
        </div>
      </div>
    `;
  }
}
