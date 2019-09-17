import { html, customElement, property } from 'lit-element';
import ls from '../ls';
import BaseElement from '../baseElement';
import page from 'page';
import rs from 'routes';
import './newPost/newPostApp';
import './settings/profile/editProfileApp';

class Page {
  constructor(public content: any, public showSidebar: boolean) {}
}

@customElement('dashboard-app')
export default class DashboardApp extends BaseElement {
  @property({ type: Object }) content: Page | null = null;

  firstUpdated() {
    page(rs.dashboard.newPost, () => {
      this.content = this.renderNewPost();
    });
    page(rs.dashboard.editProfile, () => {
      this.content = this.renderEditProfile();
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

  private renderNewPost(): Page {
    return new Page(
      html`
        <div class="m-md">
          <new-post-app></new-post-app>
        </div>
      `,
      false,
    );
  }

  private renderEditProfile(): Page {
    return new Page(
      html`
        <div class="m-md">
          <edit-profile-app></edit-profile-app>
        </div>
      `,
      true,
    );
  }
}
