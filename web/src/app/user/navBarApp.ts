import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import ls from 'ls';
import app from 'app';
import BaseElement from 'baseElement';
import { staticMainImage } from 'urls';
import routes from 'routes';
import * as defs from 'defs';
import SignOutLoader from './loaders/signOutLoader';
import User from './user';

@customElement('nav-bar-app')
export default class NavBarApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        a:hover {
          opacity: 0.8;
          background-color: #ffffff19;
        }
        a:active {
          filter: brightness(80%);
          background-color: #00000019;
        }
        a:disabled {
          pointer-events: none;
          opacity: 0.6;
        }

        navbar {
          overflow: hidden;
          display: flex;
          color: var(--navbar-fore-color);
          background-color: var(--navbar-back-color);
          border-bottom: var(--navbar-border-bottom);
        }

        navbar a {
          float: left;
          display: block;
          color: var(--navbar-fore-color);
          text-align: center;
          padding: 14px 16px;
          text-decoration: none;
          font-size: 17px;
        }

        navbar .toggler {
          display: none;
        }

        .dropdown {
          float: left;
          overflow: hidden;
        }

        .dropdown .dropdown-btn {
          font-size: 1rem;
          border: none;
          outline: none;
          color: inherit;
          padding: 14px 16px;
          background-color: inherit;
          font-family: inherit;
          margin: 0;
        }

        .dropdown-content {
          display: none;
          position: absolute;
          color: var(--navbar-fore-color);
          background-color: var(--navbar-back-color);
          border: 1px solid var(--navbar-divider-color);
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }

        .dropdown-content a {
          float: none;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
          text-align: left;
        }

        .dropdown-content hr {
          border-color: var(--navbar-divider-color);
          margin-top: 0.3rem;
          margin-bottom: 0.3rem;
        }

        .dropdown:hover .dropdown-content {
          display: block;
        }

        .fill-space {
          flex-grow: 1;
        }

        @media screen and (max-width: 600px) {
          navbar a:not(:first-child),
          .dropdown .dropdown-btn {
            display: none;
          }
          navbar a.toggler {
            float: right;
            display: block;
          }

          navbar {
            display: block;
          }

          navbar.expanded {
            position: relative;
          }
          navbar.expanded .toggler {
            position: absolute;
            right: 0;
            top: 0;
          }
          navbar.expanded a {
            float: none;
            display: block;
            text-align: left;
          }
          navbar.expanded .dropdown {
            float: none;
          }
          navbar.expanded .dropdown-content {
            position: relative;
          }
          navbar.expanded .dropdown .dropdown-btn {
            display: block;
            width: 100%;
            text-align: left;
          }
          .fill-space {
            visibility: collapse;
          }
        }
      `,
    ];
  }

  @lp.object user: User | null = null;
  @lp.number currentTheme = defs.UserTheme.light;

  firstUpdated() {
    app.state.getUserInfo(true, (user) => {
      this.user = user;
    });
    this.currentTheme = app.userData.theme;
  }

  render() {
    const { user } = this;

    return html`
      <navbar id="main-navbar">
        <a href="/">
          <img
            class="vertical-align-middle"
            src=${staticMainImage('qing.svg')}
            height="25"
            width="25"
            alt="Qing"
          />
          <span class="m-l-sm vertical-align-middle">Qing</span>
        </a>

        <div class="fill-space"></div>

        ${user
          ? html`
              <div class="dropdown">
                <button class="dropdown-btn">
                  <img
                    alt="Qing"
                    src=${user.iconURL}
                    width="20"
                    height="20"
                    class="avatar-s vertical-align-middle"
                  />
                  <span class="m-l-sm">${user.name}</span> &#x25BE;
                </button>
                <div class="dropdown-content">
                  <a href=${user.URL}>${ls.profile}</a>
                  <a href=${routes.home.yourPosts}>${ls.yourPosts}</a>
                  <a href=${routes.home.yourForumPosts}>${ls.yourForumPosts}</a>
                  <a href=${routes.home.yourForumQuestion}>${ls.yourForumQuestions}</a>
                  <hr />
                  <a href=${routes.home.newPost}>${ls.newPost}</a>
                  <a href=${routes.home.newForumPost}>${ls.newForumPost}</a>
                  <a href=${routes.home.newForumQuestion}>${ls.newForumQuestion}</a>
                  <hr />
                  <a href=${routes.home.settings.profile}>${ls.settings}</a>
                  <a href="#" @click=${this.handleSignOutClick}>${ls.signOut}</a>
                </div>
              </div>
            `
          : html`
              <a href=${routes.auth.signIn}>
                <span class="m-l-sm">${ls.signIn}</span>
              </a>
              <a href=${routes.auth.signUp}>
                <span class="m-l-sm">${ls.signUp}</span>
              </a>
            `}

        <a href="#" @click=${this.toggleTheme}>
          ${this.currentTheme === defs.UserTheme.light ? ls.themeDark : ls.themeLight}
        </a>

        <a href="#" class="toggler" @click=${this.togglerClick}>&#9776;</a>
      </navbar>
    `;
  }

  private togglerClick() {
    const navbar = this.mustGetShadowElement('main-navbar');
    navbar.classList.toggle('expanded');
  }

  private toggleTheme() {
    const newTheme =
      this.currentTheme === defs.UserTheme.light ? defs.UserTheme.dark : defs.UserTheme.light;
    this.currentTheme = newTheme;
    app.userData.theme = newTheme;
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
