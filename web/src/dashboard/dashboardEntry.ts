import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import page from 'page';
import rs from 'routes';
import BaseElement from '../baseElement';
import 'post/setPostApp';
import './settings/profile/editProfileApp';

class Page {
  constructor(public content: unknown, public showSidebar: boolean) {}
}

@customElement('dashboard-app')
export default class DashboardApp extends BaseElement {
  @property({ type: Object }) content: Page | null = null;

  set title(s: string) {
    document.title = `${s} - ${ls._siteName}`;
  }

  firstUpdated() {
    page(rs.home.newPost, () => {
      this.content = new Page(html` <set-post-app></set-post-app> `, false);
      this.title = ls.newPost;
    });
    page(`${rs.home.editPost}/:id`, (e) => {
      const { id } = e.params;
      if (!id) {
        return;
      }
      this.content = new Page(html` <set-post-app .editedID=${id}></set-post-app> `, false);
      this.title = ls.editPost;
    });
    page(rs.home.editProfile, () => {
      this.content = new Page(html` <edit-profile-app></edit-profile-app> `, true);
      this.title = ls.editProfile;
    });
    page();
  }

  render() {
    const { content } = this;
    if (!content) {
      return html` <p>${ls.noContentAvailable}</p> `;
    }
    if (!content.showSidebar) {
      return content.content;
    }
    return html`
      <container-view>
        <div class="row">
          <div class="col-md-auto">
            <aside>
              <p class="menu-label">${ls.common}</p>
              <ul class="menu-list">
                <li>
                  <a href=${rs.home.newPost}>${ls.newPost}</a>
                </li>
                <li>
                  <a href=${rs.home.posts}>${ls.posts}</a>
                </li>
              </ul>
              <p class="menu-label">${ls.settings}</p>
              <ul class="menu-list">
                <li>
                  <a href=${rs.home.editProfile}>${ls.profile}</a>
                </li>
              </ul>
            </aside>
          </div>
          <div class="col-md"><div class="m-md">${content.content}</div></div>
        </div>
      </container-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-app': DashboardApp;
  }
}
