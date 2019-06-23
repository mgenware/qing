import { html, customElement, property, LitElement } from 'lit-element';
import ls from '../../ls';
import app from '../../app';
import defs from '../../defs';
import bulmaStyle from '../styles/bulma';

@customElement('nav-bar-app')
export class NavBarApp extends LitElement {
  @property() user = app.state.user;
  @property() editProfileURL = defs.editProfileURL;

  static get styles() {
    return bulmaStyle;
  }

  render() {
    const { user } = this;
    return html`
      <div id="m_nav_menu" class="navbar-menu">
        <h1>HAHA</h1>
        <div class="navbar-end">
          ${user
            ? html`
                <div class="navbar-item has-dropdown is-hoverable">
                  <a class="navbar-link" href=${user.URL}>
                    <img
                      alt="Qing"
                      src=${user.iconURL}
                      width="20"
                      height="20"
                      class="border-radius-10 vertical-align-middle"
                    />
                    <span class="m-l-sm">${user.name}</span>
                  </a>
                  <div class="navbar-dropdown">
                    <a class="navbar-item" href=${user.URL}>${ls.profile}</a>
                    <hr class="navbar-divider" />

                    <hr class="navbar-divider" />
                    <a class="navbar-item" href=${this.editProfileURL}
                      >${ls.settings}</a
                    >
                    <a class="navbar-item" href="#">${ls.signOut}</a>
                  </div>
                </div>
              `
            : html`
                <a href="#" class="navbar-item">
                  <img
                    src="/static/img/user/login.svg"
                    width="16"
                    height="16"
                  />
                  <span class="m-l-sm">${ls.signIn}</span>
                </a>
              `}
        </div>
      </div>
    `;
  }
}
