/*
 * Some code is from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sidenav_full.
 *
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when, classMap } from 'll';
import * as lp from 'lit-props';
import ls from 'ls';
import { staticMainImage } from 'urls';
import * as mRoute from '@qing/routes/d/m';
import * as mxRoute from '@qing/routes/d/mx';
import * as authRoute from '@qing/routes/d/auth';
import * as def from 'def';
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
import { runNewEntityCommand } from 'app/appCommands';
import * as thm from './theme';
import 'ui/form/checkBox';

const slideNavID = 'app-slide-nav';
const imgSize = 25;

const dropdownBtnCls = 'dropdown-btn';
const dropdownCls = 'dropdown';

enum MenuType {
  // This type is nullable, first field must be greater than 0.
  user = 1,
  theme,
}

@customElement('navbar-app')
export default class NavbarApp extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        hr {
          margin: 0.3rem;
          border-top-color: gray;
        }

        navbar {
          display: flex;
          color: var(--app-navbar-fore-color);
          background-color: var(--app-navbar-back-color);
          border-bottom: var(--app-navbar-border-bottom);
        }

        a {
          color: var(--app-navbar-fore-color);
          padding: 0.875rem 1rem;
          text-decoration: none;
          font-size: 1.125rem;
          overflow-wrap: normal;
          word-break: normal;
          white-space: nowrap;
        }

        navbar .toggler {
          display: none;
        }

        .dropdown-btn {
          position: relative;
          display: flex;
        }

        .dropdown {
          position: absolute;
          display: none;
          top: 100%;
          right: 0;
          color: var(--app-navbar-fore-color);
          background-color: var(--app-navbar-back-color);
          border: 1px solid var(--app-navbar-divider-color);
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }

        d-block {
          display: block !important;
        }

        .dropdown .list a {
          padding: 0.75rem 1rem;
          display: block;
          text-align: left;
        }

        .dropdown .grid {
          display: grid;
          grid-template-columns: repeat(3, auto);
          place-items: center;
          margin: 0 1rem;
        }

        .dropdown .grid check-box {
          --unchecked-color: var(--app-navbar-fore-color);
          --checked-mark-color: var(--app-navbar-fore-color);
          --checked-back-color: var(----app-navbar-back-color);
        }

        .dropdown .grid .text {
          place-self: self-start;
          padding: 0.75rem 1rem;
        }

        .dropdown .grid img {
          /** Revert the default responsive img styles max-width: 100% */
          max-width: revert;
        }

        .fill-space {
          flex-grow: 1;
        }

        /** Keep in sync with the same query in JS */
        @media screen and (max-width: 600px) {
          navbar a:not(:first-child),
          .dropdown-btn {
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
  @lp.state curOpenMenu: MenuType | null = null;

  override firstUpdated() {
    appState.observe(appStateName.user, (arg) => {
      this.user = arg as User;
    });

    // Media query changes callback.
    /** Keep in sync with the same query in CSS */
    brLib.mediaQueryHandler('(max-width: 600px)', (match) => {
      if (match) {
        this.closeCurMenu();
      } else {
        this.closeSideNav(null);
      }
    });
  }

  override render() {
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
        ${this.getNavbarItems(false)}

        <a href="#" class="toggler" @click=${this.openSideNav}>&#9776;</a>
      </navbar>
      <div id=${slideNavID} class="sidenav">
        <a href="#" class="closebtn" @click=${this.closeSideNav}>&times;</a>
        ${this.getNavbarItems(true)}
      </div>
    `;
  }

  private getNavbarItems(sideNav: boolean) {
    const { user, curTheme } = this;
    const themeText = thm.textMap.get(curTheme) || '';
    const themeIcon = staticMainImage(thm.iconMap.get(curTheme) || '');

    if (!user) {
      return html`
        <a href=${authRoute.signIn}>${ls.signIn}</a>
        <a href=${authRoute.signUp}>${ls.signUp}</a>
      `;
    }

    const userRootBtn = html`<a
      href="#"
      @click=${(e: Event) => this.handleMenuBtnClick(e, MenuType.user)}>
      <img
        alt=${user.name}
        src=${user.iconURL}
        width=${imgSize}
        height=${imgSize}
        class="avatar-s vertical-align-middle" />
      <span class="m-l-sm vertical-align-middle">${user.name}&nbsp;&nbsp;&#x25BE;</span>
    </a>`;

    const userContent = html`
      <div class=${dropdownBtnCls}>
        ${userRootBtn} ${when(!sideNav, () => this.renderUserMenu(user, false))}
      </div>
      ${when(sideNav, () => this.renderUserMenu(user, true))}
    `;

    const themeRootBtn = html`<a
      href="#"
      @click=${(e: Event) => this.handleMenuBtnClick(e, MenuType.theme)}>
      <img
        title=${themeText}
        alt=${themeText}
        src=${themeIcon}
        width=${imgSize}
        height=${imgSize}
        class="avatar-s vertical-align-middle" />
    </a>`;
    const themeContent = html` <div class=${dropdownBtnCls}>
        ${themeRootBtn} ${when(!sideNav, () => this.renderThemeMenu(false))}
      </div>
      ${when(sideNav, () => this.renderThemeMenu(true))}`;

    return html`${userContent}${themeContent}`;
  }

  private getMenuCls(sideNav: boolean, menu: MenuType) {
    return classMap({
      [dropdownCls]: !sideNav,
      'd-block': this.curOpenMenu === menu,
    });
  }

  private renderUserMenu(user: User, sideNav: boolean) {
    return html`
      <div class=${this.getMenuCls(sideNav, MenuType.user)}>
        <div class="list">
          <a href=${user.url}>${ls.profile}</a>
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
          <a href="#" @click=${this.handleSignOutClick}>${ls.signOut}</a>
        </div>
      </div>
    `;
  }

  private renderThemeOption(theme: def.UserTheme) {
    const text = thm.textMap.get(theme) || '';
    const icon = thm.iconMap.get(theme) || '';
    return html`<a
      href="#"
      style="display:contents"
      @click=${(e: Event) => this.handleThemeOptionClick(e, theme)}>
      <check-box radio ?checked=${this.curTheme === theme}></check-box>
      <div class="text">&nbsp;${text}</div>
      <img
        title=${text}
        alt=${text}
        src=${staticMainImage(icon)}
        width=${imgSize}
        height=${imgSize} />
    </a>`;
  }

  private handleThemeOptionClick(e: Event, theme: def.UserTheme) {
    e.preventDefault();
    if (this.curTheme === theme) {
      return;
    }
    this.applyTheme(theme);
  }

  private renderThemeMenu(sideNav: boolean) {
    return html`
      <div class=${this.getMenuCls(sideNav, MenuType.theme)}>
        <div class="grid">
          ${this.renderThemeOption(def.UserTheme.light)}
          ${this.renderThemeOption(def.UserTheme.dark)}
          ${this.renderThemeOption(def.UserTheme.device)}
        </div>
      </div>
    `;
  }

  private applyTheme(newTheme: def.UserTheme) {
    AppSettings.instance.theme = newTheme;
    this.curTheme = newTheme;
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

  private handleMenuBtnClick(e: Event, type: MenuType) {
    e.preventDefault();
    // Stop propagation so that this click event is not captured by `showMenu`.
    e.stopPropagation();

    if (this.curOpenMenu === type) {
      // Close the open menu.
      this.closeCurMenu();
    } else if (this.curOpenMenu) {
      // Switch to another menu.
      this.curOpenMenu = type;
    } else {
      // Open the specified menu.
      this.showMenu(type);
    }
  }

  private showMenu(type: MenuType) {
    // Listen for doc events to close the menu if necessary.
    document.addEventListener('click', this.handleDocClickForMenus);
    document.addEventListener('keydown', this.handleDocKeydownForMenus);
    this.curOpenMenu = type;
  }

  private closeCurMenu() {
    if (!this.curOpenMenu) {
      return;
    }
    document.removeEventListener('click', this.handleDocClickForMenus);
    document.removeEventListener('keydown', this.handleDocKeydownForMenus);
    this.curOpenMenu = null;
  }

  // Must be an arrow func for adding and removing handlers to work.
  handleDocClickForMenus = () => {
    // Any clicks will cause the menu to hide including the ones from the menu itself.
    // For example, clicking "New post" triggers an overlay, the menu must hide as well.
    this.closeCurMenu();
  };

  // Must be an arrow func for adding and removing handlers to work.
  handleDocKeydownForMenus = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.closeCurMenu();
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
    'navbar-app': NavbarApp;
  }
}
