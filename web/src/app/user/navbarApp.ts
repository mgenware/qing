/*
 * Some code is from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sidenav_full.
 *
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when, classMap, state } from 'll';
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
import { runNewEntityCommand } from 'app/appCommands';
import * as thm from './theme';
import * as brLib from 'lib/brLib';
import 'ui/form/checkBox';

const sideNavID = 'sidenav';
const imgSize = 25;

const dropdownBtnCls = 'dropdown-btn';
const dropdownCls = 'dropdown';
const sideNavHeaderCls = 'header';
// Applied to root elements of menu or sidenav header.
const userGroupCls = 'user-group';
const themeGroupCls = 'theme-group';
const avatarImgCls = 'avatar-s vertical-align-middle';

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
          align-items: center;
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

        /** Shared grid style between .dropdown and #sidenav */
        .grid {
          display: inline-grid;
          grid-template-columns: repeat(3, auto);
          place-items: center;
          margin: 0 1rem;
        }

        .grid .text {
          place-self: self-start;
          padding: 0.75rem 1rem;
        }

        .dropdown .grid check-box {
          --unchecked-color: var(--app-navbar-fore-color);
          --checked-mark-color: var(--app-navbar-fore-color);
          --checked-back-color: var(----app-navbar-back-color);
        }

        .dropdown .grid img {
          /** Revert the default responsive img styles max-width: 100% */
          max-width: revert;
        }

        .fill-space {
          flex-grow: 1;
        }

        #sidenav {
          display: none;
        }

        /** Keep in sync with the same query in JS */
        @media screen and (max-width: 768px) {
          navbar a:not(:first-child),
          .dropdown-btn {
            display: none;
          }
          navbar a.toggler {
            display: block;
          }

          #sidenav {
            display: block;
            height: 100vh;
            width: 100vw;
            position: fixed;
            overflow-y: auto;
            overflow-x: hidden;
            z-index: 1;
            top: 0;
            left: 0;
            color: #818181;
            background-color: #111;
            transform: translateX(-100%);
            transition: 0.5s;
            padding-bottom: 2rem;
            text-align: center;
          }

          #sidenav.slide-in {
            transform: translateX(0%);
          }

          #sidenav a {
            padding: 0.5rem;
            text-decoration: none;
            font-size: 1.4rem;
            color: #818181;
            display: block;
            transition: 0.3s;
          }

          #sidenav check-box {
            --unchecked-color: #818181;
            --checked-mark-color: #818181;
            --checked-back-color: #818181;
          }

          #sidenav a:hover {
            color: #f1f1f1;
          }

          #sidenav .close-btn-row {
            display: block;
            text-align: right;
          }

          #sidenav .close-btn {
            display: inline-block;
            margin-right: 1rem;
            margin-bottom: 0.2rem;
            font-size: 2.2rem;
            padding: 0.8rem 1rem;
          }

          #sidenav .header {
            font-size: 1.8rem;
            padding: 0.5rem;
            margin: 0 1rem 0.4rem 1rem;
            border-bottom: 1px solid gray;
          }

          #sidenav .header:not(:first-child) {
            margin-top: 1.6rem;
          }

          #sidenav hr {
            margin-left: 3rem;
            margin-right: 3rem;
            border-top-color: #3c3c3c;
          }
        }
      `,
    ];
  }

  @state() user = appPageState.user;
  @state() curTheme = AppSettings.instance.theme;
  @state() curOpenMenu: MenuType | null = null;
  @state() sideNavOpen = false;

  override firstUpdated() {
    appState.observe(appStateName.user, (arg) => {
      this.user = arg as User;
    });
    brLib.mediaQueryHandler(
      '(max-width: 768px)',
      (mobile) => {
        // Close sidenav when switching to desktop.
        if (!mobile && this.sideNavOpen) {
          this.closeSideNav(null);
        }
      },
      true,
    );
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
            title=${ls.qingSiteName}
            alt=${ls.qingSiteName} />
          <span class="m-l-sm vertical-align-middle">${ls.qingSiteName}</span>
        </a>

        <div class="fill-space"></div>
        ${this.getNavbarItems(false)}

        <a href="#" class="toggler" @click=${(e: Event) => this.showSideNav(e)}>&#9776;</a>
      </navbar>
      <div id=${sideNavID} class=${this.sideNavOpen ? 'slide-in' : ''}>
        <div class="close-btn-row">
          <a href="#" class="close-btn" @click=${(e: Event) => this.closeSideNav(e)}>&times;</a>
        </div>
        ${this.getNavbarItems(true)}
      </div>
    `;
  }

  private getNavbarItems(sideNav: boolean) {
    const { user, curTheme } = this;

    const btnCls = sideNav ? sideNavHeaderCls : dropdownBtnCls;
    const themeText = thm.textMap.get(curTheme) || '';
    const themeIcon = staticMainImage(thm.iconMap.get(curTheme) || '');

    let themeBtn = sideNav
      ? html`${ls.theme}`
      : html`<img
          title=${themeText}
          alt=${themeText}
          src=${themeIcon}
          width=${imgSize}
          height=${imgSize}
          class=${avatarImgCls} />`;
    if (!sideNav) {
      themeBtn = html`<a
        href="#"
        @click=${(e: Event) => this.handleMenuBtnClick(e, MenuType.theme)}>
        ${themeBtn}
      </a>`;
    }
    const themeContent = html` <div class=${`${btnCls} ${themeGroupCls}`}>
        ${themeBtn} ${when(!sideNav, () => this.renderThemeMenu(false))}
      </div>
      ${when(sideNav, () => this.renderThemeMenu(true))}`;

    if (!user) {
      return html`
        <a href=${authRoute.signIn}>${ls.signIn}</a>
        <a href=${authRoute.signUp}>${ls.signUp}</a>
        ${themeContent}
      `;
    }

    let userBtn = html`<img
        alt=${user.name}
        src=${user.iconURL}
        width=${imgSize}
        height=${imgSize}
        class=${avatarImgCls} />
      <span class="m-l-sm vertical-align-middle"
        >${user.name}&nbsp;&nbsp;${sideNav ? '' : html`&#x25BE;`}</span
      >`;
    if (!sideNav) {
      userBtn = html`<a href="#" @click=${(e: Event) => this.handleMenuBtnClick(e, MenuType.user)}>
        ${userBtn}
      </a>`;
    }

    const userResult = html`
      <div class=${`${btnCls} ${userGroupCls}`}>
        ${userBtn} ${when(!sideNav, () => this.renderUserMenu(user, false))}
      </div>
      ${when(sideNav, () => this.renderUserMenu(user, true))}
    `;

    return html`${userResult}${themeContent}`;
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
          <a href="#" @click=${(e: Event) => this.handleNewPostClick(e, appdef.contentBaseTypePost)}
            >${ls.newPost}</a
          >
          <a
            href="#"
            @click=${(e: Event) => this.handleNewPostClick(e, appdef.contentBaseTypeThread)}
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
      <div class="text">${text}</div>
      <img
        title=${text}
        alt=${text}
        src=${staticMainImage(icon)}
        width=${imgSize}
        height=${imgSize} />
    </a>`;
  }

  private showSideNav(e: Event | null) {
    e?.preventDefault();
    this.handleEsc(() => this.closeSideNav(null));
    this.setSideNavOpen(true);
  }

  private closeSideNav(e: Event | null) {
    e?.preventDefault();
    if (this.sideNavOpen) {
      this.setSideNavOpen(false);
    }
  }

  private setSideNavOpen(open: boolean) {
    this.sideNavOpen = open;
    // Update body scrolling status.
    document.body.style.overflow = open ? 'hidden' : '';
  }

  private handleThemeOptionClick(e: Event, theme: def.UserTheme) {
    e.preventDefault();
    this.closeCurMenu();
    this.closeSideNav(null);
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

  private async handleSignOutClick(e: Event) {
    e.preventDefault();
    const loader = new SignOutLoader();
    const res = await appTask.critical(loader);
    if (res.isSuccess) {
      pageUtils.reload();
    }
  }

  private handleNewPostClick(e: Event, entityType: number) {
    e.preventDefault();
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
    document.addEventListener('click', this.handleDocClickForMenus, { once: true });
    this.handleEsc(() => this.closeCurMenu());
    this.curOpenMenu = type;
  }

  private closeCurMenu() {
    if (!this.curOpenMenu) {
      return;
    }
    document.removeEventListener('click', this.handleDocClickForMenus);
    this.curOpenMenu = null;
  }

  // Make sure `handler` doesn't have any side effects and thus can be called multiple times.
  private handleEsc(handler: () => void) {
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Escape') {
          handler();
        }
      },
      { once: true },
    );
  }

  // Must be an arrow func for adding and removing handlers to work.
  handleDocClickForMenus = () => {
    // Any clicks will cause the menu to hide including the ones from the menu itself.
    // For example, clicking "New post" triggers an overlay, the menu must hide as well.
    this.closeCurMenu();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'navbar-app': NavbarApp;
  }
}
