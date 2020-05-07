import { html, customElement, TemplateResult } from 'lit-element';
import * as lp from 'lit-props';
import ls from 'ls';
import app from 'app';
import rs from 'routes';
import BaseElement from 'baseElement';
import User from './user';
import bulmaStyles from 'app/styles/navbar-min';
import * as defs from 'defs';
import SignOutLoader from './loaders/signOutLoader';
import { staticMainImage } from 'urls';
import routes from 'routes';

@customElement('nav-bar-app')
export default class NavBarApp extends BaseElement {
  static get styles() {
    return [super.styles, bulmaStyles];
  }

  @lp.object user: User | null = null;
  @lp.number currentTheme = defs.UserTheme.light;

  firstUpdated() {
    app.state.getUserInfo(true, (user) => {
      this.user = user;
    });
    this.currentTheme = app.userData.theme;

    // navbar
    // navbar burger click event
    const burger = this.getShadowElement('m_nav_burger');
    if (burger) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('is-active');
        const navMenu = this.getShadowElement('m_nav_menu');
        if (navMenu) {
          navMenu.classList.toggle('is-active');
        }
      });
    } else {
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
                      class="avatar-s vertical-align-middle"
                    />
                    <span class="m-l-sm">${user.name}</span>
                  </a>
                  <div class="navbar-dropdown">
                    <a class="navbar-item" href=${user.URL}>${ls.profile}</a>
                    <hr class="navbar-divider" />
                    <a class="navbar-item" href=${rs.m.editProfile}
                      >${ls.settings}</a
                    >
                    <a
                      class="navbar-item"
                      href="#"
                      @click=${this.handleSignOutClick}
                      >${ls.signOut}</a
                    >
                  </div>
                </div>
              `
            : html`
                <a href=${routes.auth.signIn} class="navbar-item">
                  <span class="m-l-sm">${ls.signIn}</span>
                </a>
                <a href=${routes.auth.signUp} class="navbar-item">
                  <span class="m-l-sm">${ls.signUp}</span>
                </a>
              `}
          <a class="navbar-item" href="#" @click=${this.toggleTheme}>
            ${this.currentTheme === defs.UserTheme.light
              ? ls.themeDark
              : ls.themeLight}
          </a>
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
              src=${staticMainImage('qing.svg')}
              height="25"
              width="25"
              alt="Qing"
            />
            <span class="m-l-sm">Qing</span>
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

  private toggleTheme() {
    const newTheme =
      this.currentTheme === defs.UserTheme.light
        ? defs.UserTheme.dark
        : defs.UserTheme.light;
    this.currentTheme = app.userData.theme = newTheme;
  }

  private async handleSignOutClick() {
    const loader = new SignOutLoader();
    const res = await app.runGlobalActionAsync(loader);
    if (res.isSuccess) {
      app.browser.reload();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nav-bar-app': NavBarApp;
  }
}
