import { html, customElement, property } from 'lit-element';
import ls from '../ls';
import BaseElement from '../baseElement';
import page from 'page';
import * as rs from './routes';
import './newPost/newPostApp';

class Page {
  constructor(public content: any, public showSidebar: boolean) {}
}

@customElement('m-app')
export default class MApp extends BaseElement {
  @property() content: Page | null = null;

  firstUpdated() {
    page(rs.newPostURL, () => {
      this.content = this.renderNewPost();
    });
    page();
  }

  render() {
    const { content } = this;
    if (!content) {
      return;
    }
    if (!content.showSidebar) {
      return content.content;
    }
    return html`
      <section class="section">
        <div class="container">
          <div class="columns is-variable is-7">
            <div class="column is-narrow">
              <aside class="menu">
                <p class="menu-label">${ls.common}</p>
                <ul class="menu-list">
                  <li>
                    <a href=${rs.newPostURL}>${ls.newPost}</a>
                  </li>
                </ul>
                <p class="menu-label">${ls.settings}</p>
                <ul class="menu-list">
                  <li>
                    <a href="/m/settings/profile">${ls.profile}</a>
                  </li>
                </ul>
              </aside>
            </div>
            <div class="column">${content.content}</div>
          </div>
        </div>
      </section>
    `;
  }

  private renderNewPost(): any {
    return new Page(
      html`
        <div class="m-md">
          <new-post-app></new-post-app>
        </div>
      `,
      false,
    );
  }
}
