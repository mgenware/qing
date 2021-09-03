/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import ls from 'ls';
import { staticMainImage } from 'urls';
import routes from 'routes';
import * as defs from 'defs';
import SignOutLoader from './loaders/signOutLoader';
import User from './user';
import { tif } from 'lib/htmlLib';
import appPageState from 'app/appPageState';
import appState from 'app/appState';
import appStateName from 'app/appStateName';
import appTask from 'app/appTask';
import pageUtils from 'app/utils/pageUtils';
import appSettings from 'app/appSettings';
import { entityDiscussion, entityPost, entityQuestion } from 'sharedConstants';
import { runNewEntityCommand } from 'app/appCommands';

@customElement('nav-bar-app')
export default class NavBarApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

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
          color: var(--app-navbar-fore-color);
          background-color: var(--app-navbar-back-color);
          border-bottom: var(--app-navbar-border-bottom);
        }

        navbar a {
          float: left;
          display: block;
          color: var(--app-navbar-fore-color);
          text-align: center;
          padding: 0.875rem 1rem;
          text-decoration: none;
          font-size: 1.125rem;
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
          padding: 0.875rem 1rem;
          background-color: inherit;
          font-family: inherit;
          margin: 0;
        }

        .dropdown-content {
          display: none;
          position: absolute;
          color: var(--app-navbar-fore-color);
          background-color: var(--app-navbar-back-color);
          border: 1px solid var(--app-navbar-divider-color);
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }

        .dropdown-content a {
          float: none;
          padding: 0.75rem 1rem;
          text-decoration: none;
          display: block;
          text-align: left;
        }

        .dropdown-content hr {
          border-color: var(--app-navbar-divider-color);
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
    this.user = appPageState.user;
    this.currentTheme = appSettings.theme;

    appState.observe<User>((name, value) => {
      if (name === appStateName.user) {
        this.user = value;
      }
    });
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
                  <a href=${user.url}>${ls.profile}</a>
                  <a href=${routes.m.yourPosts}>${ls.yourPosts}</a>
                  <a href=${routes.m.yourDiscussions}>${ls.yourDiscussions}</a>
                  <a href=${routes.m.yourQuestion}>${ls.yourQuestions}</a>
                  <hr />
                  <a href="#" @click=${() => this.handleNewPostClick(entityPost)}>${ls.newPost}</a>
                  <a href="#" @click=${() => this.handleNewPostClick(entityDiscussion)}
                    >${ls.newDiscussion}</a
                  >
                  <a href="#" @click=${() => this.handleNewPostClick(entityQuestion)}
                    >${ls.newQuestion}</a
                  >
                  <hr />
                  <a href=${routes.m.settings.profile}>${ls.settings}</a>
                  ${tif(
                    user.admin,
                    html`<a href=${routes.mx.usersAndGroups}>${ls.adminSettings}</a>`,
                  )}
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
    const navbar = this.getShadowElement('main-navbar');
    navbar?.classList.toggle('expanded');
  }

  private toggleTheme() {
    const newTheme =
      this.currentTheme === defs.UserTheme.light ? defs.UserTheme.dark : defs.UserTheme.light;
    this.currentTheme = newTheme;
    appSettings.theme = newTheme;
  }

  private async handleSignOutClick() {
    const loader = new SignOutLoader();
    const res = await appTask.critical(loader);
    if (res.isSuccess) {
      pageUtils.reload();
    }
  }

  private handleNewPostClick(entityType: number) {
    runNewEntityCommand(entityType);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nav-bar-app': NavBarApp;
  }
}
