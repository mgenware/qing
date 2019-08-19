import { html, customElement, property, TemplateResult } from 'lit-element';
import ls from 'ls';
import app from 'app';
import rs from 'routes';
import BaseElement from 'baseElement';
import User from './user';
import bulmaStyles from 'app/styles/bulma';

@customElement('nav-bar-app')
export default class NavBarApp extends BaseElement {
  static get styles() {
    return [super.styles, bulmaStyles];
  }

  @property() user: User | null = null;

  firstUpdated() {
    app.state.getUserInfo(true, user => {
      this.user = user;
    });

    // navbar
    // navbar burger click event
    const burger = this.shadowRoot!.getElementById('m_nav_burger');
    if (burger) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('is-active');
        const navMenu = this.shadowRoot!.getElementById('m_nav_menu');
        if (navMenu) {
          navMenu.classList.toggle('is-active');
        }
      });
    } else {
      // tslint:disable-next-line no-console
      console.error(`navbar setup failed, m_nav_burger not defined`);
    }
  }

  render() {
    const { user } = this;
    return this.renderChrome(html`
      <div id="m_nav_menu" class="navbar-menu">
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
                    <a class="navbar-item" href=${rs.dashboard.editProfile}
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
    `);
  }

  private renderChrome(child: any): TemplateResult {
    return html`
      <nav class="navbar is-dark" role="navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img
              src="/static/img/main/qing.png"
              height="25"
              width="25"
              alt="Qing"
            />
            <span>&nbsp;Qing</span>
          </a>

          <a
            role="button"
            class="navbar-burger button is-dark"
            aria-label="menu"
            aria-expanded="false"
            id="m_nav_burger"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        ${child}
      </nav>
    `;
  }
}
