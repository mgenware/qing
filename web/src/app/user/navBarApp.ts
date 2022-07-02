/*
 * Some code is from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sidenav_full.
 *
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when, TemplateResult } from 'll';
import * as lp from 'lit-props';
import ls from 'ls';
import { staticMainImage } from 'urls';
import * as mRoute from '@qing/routes/d/m';
import * as mxRoute from '@qing/routes/d/mx';
import * as authRoute from '@qing/routes/d/auth';
import * as defs from 'defs';
import SignOutLoader from './loaders/signOutLoader';
import User from './user';
import appPageState from 'app/appPageState';
import appState from 'app/appState';
import appStateName from 'app/appStateName';
import appTask from 'app/appTask';
import pageUtils from 'app/utils/pageUtils';
import AppSettings from 'app/appSettings';
import { appdef } from '@qing/def';
import * as brLib from 'lib/brLib';
import { computePosition, autoUpdate } from '@floating-ui/dom';
import { runNewEntityCommand } from 'app/appCommands';
import { imgMain } from '@qing/routes/d/static';

const slideNavID = 'appSlideNav';
const userMenuBtnID = 'userMenuBtn';
const userMenuID = 'userMenu';
const themeMenuBtnID = 'themeMenuBtn';
const themeMenuID = 'themeMenu';
const imgSize = 25;

// Contains element IDs use to identify a menu menu.
interface MenuElements {
  // ID of menu button.
  btnEl: string;
  // ID of menu menu.
  menuEl: string;
}

@customElement('nav-bar-app')
export default class NavBarApp extends BaseElement {
  static override get styles() {
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

        navbar > a,
        .menu > a {
          color: var(--app-navbar-fore-color);
          text-align: center;
          padding: 0.875rem 1rem;
          text-decoration: none;
          font-size: 1.125rem;
        }

        navbar .toggler {
          display: none;
        }

        .menu {
          position: absolute;
          top: 0;
          left: 0;
          display: none;
          color: var(--app-navbar-fore-color);
          background-color: var(--app-navbar-back-color);
          border: 1px solid var(--app-navbar-divider-color);
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }

        .menu a {
          padding: 0.75rem 1rem;
          text-decoration: none;
          display: block;
          text-align: left;
        }

        .fill-space {
          flex-grow: 1;
        }

        /** Keep in sync with the same query in JS */
        @media screen and (max-width: 600px) {
          navbar a:not(:first-child),
          .menu {
            display: none;
          }
          navbar a.toggler {
            display: block;
          }
        }

        .sidenav {
          height: 100%;
          width: 0;
          position: fixed;
          z-index: 1;
          top: 0;
          left: 0;
          background-color: #111;
          overflow-x: hidden;
          transition: 0.5s;
          padding-top: 60px;
          text-align: center;
        }

        .sidenav a,
        .sidenav .sub-title {
          padding: 0.5rem 0.5rem 0.5rem 2rem;
          text-decoration: none;
          font-size: 1.5rem;
          color: #818181;
          display: block;
          transition: 0.3s;
        }

        .sidenav a.sub-item {
          font-size: 1.1rem;
        }

        .sidenav a:hover {
          color: #f1f1f1;
        }

        .sidenav .closebtn {
          position: absolute;
          top: 0;
          right: 25px;
          font-size: 36px;
          margin-left: 50px;
        }

        @media screen and (max-height: 450px) {
          .sidenav {
            padding-top: 15px;
          }
          .sidenav a {
            font-size: 18px;
          }
        }
      `,
    ];
  }

  @lp.state user = appPageState.user;
  @lp.state curTheme = AppSettings.instance.theme;
  @lp.state curThemeIcon = '';
  @lp.state curThemeText = '';

  // Menu related vars.
  #curMenu?: MenuElements;
  #disposeCurMenu?: () => void;

  override firstUpdated() {
    this.updateThemeProps();

    appState.observe(appStateName.user, (arg) => {
      this.user = arg as User;
    });

    // Media query changes callback.
    /** Keep in sync with the same query in CSS */
    brLib.mediaQueryHandler('(max-width: 600px)', (match) => {
      if (match) {
        this.hideUserMenu();
      } else {
        this.closeSideNav(null);
      }
    });
  }

  override render() {
    const { user } = this;
    return html`
      <navbar id="main-navbar">
        <a href="/">
          <img
            class="vertical-align-middle"
            src=${staticMainImage('qing.svg')}
            height=${imgSize}
            width=${imgSize}
            title=${ls._siteName}
            alt=${ls._siteName} />
          <span class="m-l-sm vertical-align-middle">${ls._siteName}</span>
        </a>

        <div class="fill-space"></div>
        ${this.getNavbarItems(false)} ${this.renderThemeMenu()}

        <a id=${themeMenuBtnID} href="#" @click=${this.handleThemeMenuClick}>
          <img
            title=${this.curThemeText}
            alt=${this.curThemeText}
            src=${staticMainImage(this.curThemeIcon)}
            width=${imgSize}
            height=${imgSize}
            class="avatar-s vertical-align-middle" />
        </a>

        <a href="#" class="toggler" @click=${this.openSideNav}>&#9776;</a>
      </navbar>
      ${user ? this.renderUserMenu(user) : ''}
      <div id=${slideNavID} class="sidenav">
        <a href="#" class="closebtn" @click=${this.closeSideNav}>&times;</a>
        ${this.getNavbarItems(true)}
      </div>
    `;
  }

  private getNavbarItems(_sideNav: boolean) {
    const { user } = this;
    return user
      ? html`
          <a id=${userMenuBtnID} href="#" @click=${this.handleProfileMenuClick}>
            <img
              alt=${user.name}
              src=${user.iconURL}
              width=${imgSize}
              height=${imgSize}
              class="avatar-s vertical-align-middle" />
            <span class="m-l-sm vertical-align-middle">${user.name}&nbsp;&nbsp;&#x25BE;</span>
          </a>
        `
      : html`
          <a href=${authRoute.signIn}>${ls.signIn}</a>
          <a href=${authRoute.signUp}>${ls.signUp}</a>
        `;
  }

  private renderMenu(id: string, content: TemplateResult) {
    return html` <div id=${id} class="menu">${content}</div> `;
  }

  private renderUserMenu(user: User) {
    return this.renderMenu(
      userMenuID,
      html`<a href=${user.url}>${ls.profile}</a>
        <a href=${mRoute.yourPosts}>${ls.yourPosts}</a>
        <a href=${mRoute.yourThreads}>${ls.yourThreads}</a>
        <hr />
        <a href="#" @click=${() => this.handleNewPostClick(appdef.contentBaseTypePost)}
          >${ls.newPost}</a
        >
        <a href="#" @click=${() => this.handleNewPostClick(appdef.contentBaseTypeThread)}
          >${ls.newThread}</a
        >
        <hr />
        <a href=${mRoute.settingsProfile}>${ls.settings}</a>
        ${when(user.admin, () => html`<a href=${mxRoute.admins}>${ls.siteSettings}</a>`)}
        <a href="#" @click=${this.handleSignOutClick}>${ls.signOut}</a>`,
    );
  }

  private renderThemeOption(option: defs.UserTheme, text: string) {
    return html` <a href="#">
      <input type="radio" ?checked=${this.currentTheme === option} />
      <span>${text}</span>
    </a>`;
  }

  private renderThemeMenu() {
    return this.renderMenu(
      themeMenuID,
      html`
        ${this.renderThemeOption(defs.UserTheme.light, ls.themeLight)},
        ${this.renderThemeOption(defs.UserTheme.dark, ls.themeDark)},
        ${this.renderThemeOption(defs.UserTheme.device, ls.themeDevice)},
      `,
    );
  }

  private updateThemeProps() {
    let icon: string;
    let iconText: string;
    switch (this.curTheme) {
      case defs.UserTheme.light:
        icon = 'light-mode';
        iconText = ls.themeLight;
        break;

      case defs.UserTheme.dark:
        icon = 'dark-mode';
        iconText = ls.themeDark;
        break;

      case defs.UserTheme.device:
        icon = 'device';
        iconText = ls.themeDevice;
        break;

      default:
        icon = '';
        iconText = '';
        break;
    }

    if (icon) {
      return staticMainImage(`${icon}.svg`);
    }
    this.curThemeIcon = icon;
    this.curThemeText = iconText;
  }

  private toggleTheme() {
    const newTheme =
      this.currentTheme === defs.UserTheme.light ? defs.UserTheme.dark : defs.UserTheme.light;
    this.currentTheme = newTheme;
    AppSettings.instance.theme = newTheme;
  }

  private async handleSignOutClick() {
    const loader = new SignOutLoader();
    const res = await appTask.critical(loader);
    if (res.isSuccess) {
      pageUtils.reload();
    }
  }

  private handleNewPostClick(entityType: number) {
    runNewEntityCommand(entityType, null);
  }

  private handleProfileMenuClick(e: Event) {
    e.preventDefault();
    // Stop propagation so that this click event is not captured by `showUserMenu`.
    e.stopPropagation();

    if (this.profileMenuExpanded) {
      this.hideUserMenu();
    } else {
      this.showUserMenu();
    }
  }

  private showUserMenu() {
    const sourceEl = this.userMenuBtnEl;
    const menuEl = this.userMenuEl;
    if (!sourceEl || !menuEl) {
      return;
    }

    this.autoUpdateCleanUp = autoUpdate(sourceEl, menuEl, () => {
      // https://floating-ui.com/docs/autoupdate
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      computePosition(sourceEl, menuEl, {
        placement: 'bottom-start',
      }).then(({ x, y }) => {
        const isSourceElHidden = window.getComputedStyle(sourceEl).display === 'none';
        if (isSourceElHidden) {
          menuEl.style.display = 'none';
        } else {
          menuEl.style.left = `${x}px`;
          menuEl.style.top = `${y}px`;
          menuEl.style.display = 'block';
        }
      });
    });

    // Listen for doc events to close the menu if necessary.
    document.addEventListener('click', this.handleDocClickForMenus);
    document.addEventListener('keydown', this.handleDocKeydownForMenus);

    this.profileMenuExpanded = true;
  }

  private hideUserMenu() {
    const el = this.userMenuEl;
    if (el) {
      el.style.display = 'none';
    }
    document.removeEventListener('click', this.handleDocClickForMenus);
    document.removeEventListener('keydown', this.handleDocKeydownForMenus);
    this.autoUpdateCleanUp?.();
    this.autoUpdateCleanUp = undefined;
    this.profileMenuExpanded = false;
  }

  // Must be an arrow func for adding and removing handlers to work.
  handleDocClickForMenus = () => {
    // Any clicks will cause the menu to hide including the ones from the menu itself.
    // For example, clicking "New post" triggers an overlay, the menu must hide as well.
    this.hideUserMenu();
  };

  // Must be an arrow func for adding and removing handlers to work.
  handleDocKeydownForMenus = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.hideUserMenu();
    }
  };

  private openSideNav(e: Event | null) {
    e?.preventDefault();
    const slideNav = this.getShadowElement(slideNavID);
    if (slideNav) {
      slideNav.style.width = '100vw';
    }
  }

  private closeSideNav(e: Event | null) {
    e?.preventDefault();
    const slideNav = this.getShadowElement(slideNavID);
    if (slideNav) {
      slideNav.style.width = '0';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nav-bar-app': NavBarApp;
  }
}
