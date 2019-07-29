import { html, customElement, property } from 'lit-element';
import ls from '../ls';
import Element from '../element';
import page from 'page';
import * as rs from './routes';
import './compose/mComposeApp';

@customElement('m-app')
export default class MApp extends Element {
  @property() route = '';

  firstUpdated() {
    page('/new-post', () => {});
  }

  render() {
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
            <div class="column">${this.renderContent()}</div>
          </div>
        </div>
      </section>
    `;
  }

  private renderContent() {
    const r = this.route || rs.newPost;
    switch (r) {
      case rs.newPost:
        return html`
          <m-compose-app></m-compose-app>
        `;
    }
    return null;
  }
}
