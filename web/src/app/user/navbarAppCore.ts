/*
 * Some code is from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sidenav_full.
 *
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, html, css, when, classMap, state, TemplateResult } from 'll';
import { staticMainImage } from 'urls';
import * as def from 'def';
import AppSettings from 'app/appSettings';
import * as thm from './theme';
import * as brLib from 'lib/brLib';
import 'ui/forms/checkBox';

const ls = globalThis.coreLS;
const sideNavID = 'sidenav';
export const imgSize = 25;

const dropdownBtnCls = 'dropdown-btn';
const dropdownCls = 'dropdown';
const sideNavHeaderCls = 'header';

const themeDropdownID = 'sys-theme';

export abstract class NavbarAppCore extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        hr {
          margin: 0.3rem;
          border-top: 1px solid var(--app-navbar-separator-color);
        }

        .navbar-row {
          color: var(--app-navbar-fore-color);
          background-color: var(--app-navbar-back-color);
          border-bottom: var(--app-navbar-border-bottom);
        }

        #main-navbar {
          display: flex;
          align-items: center;
          margin-left: auto;
          margin-right: auto;
          max-width: 1320px;
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

        #main-navbar .toggler {
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
          border: 1px solid var(--app-navbar-dropdown-border-color);
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }

        .dropdown.d-block {
          display: block;
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
          #main-navbar a:not(:first-child),
          .dropdown-btn {
            display: none;
          }
          #main-navbar a.toggler {
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

  @state() curTheme = AppSettings.instance.theme;
  @state() curOpenDropdown?: string;
  @state() sideNavOpen = false;

  override firstUpdated() {
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
      <div class="navbar-row">
        <nav id="main-navbar">
          <a href="/">
            <img
              class="vertical-align-middle"
              src=${this.getSiteIconSrc()}
              height=${imgSize}
              width=${imgSize}
              title=${this.getSiteName()}
              alt=${this.getSiteName()} />
            <span class="m-l-sm vertical-align-middle">${this.getSiteName()}</span>
          </a>

          <div class="fill-space"></div>
          ${this.renderMenus(false)}

          <a href="#" class="toggler" @click=${(e: Event) => this.showSideNav(e)}
            >&#9776; ${ls.menu}</a
          >
        </nav>
      </div>
      <div id=${sideNavID} class=${this.sideNavOpen ? 'slide-in' : ''}>
        <div class="close-btn-row">
          <a href="#" class="close-btn" @click=${(e: Event) => this.closeSideNav(e)}>&times;</a>
        </div>
        ${this.renderMenus(true)}
      </div>
    `;
  }

  protected abstract getSiteName(): string;
  protected abstract getSiteIconSrc(): string;

  protected renderCustomMenus(_sideNav: boolean): TemplateResult | null {
    return null;
  }

  private renderMenus(sideNav: boolean) {
    const themeBtn = this.renderThemeMenuItem(sideNav);
    return html`${this.renderCustomMenus(sideNav)}${themeBtn}`;
  }

  // On desktop, `headerFn` renders navbar button. `dropdownFn` renders dropdown menu.
  // On mobile, `headerFn` renders side nav section header. `dropdownFn` renders sublist.
  protected renderMenuItem(
    dropdownID: string,
    sideNav: boolean,
    headerFn: (sideNav: boolean) => TemplateResult,
    dropdownFn: (sideNav: boolean) => TemplateResult,
  ) {
    const btnCls = sideNav ? sideNavHeaderCls : dropdownBtnCls;

    // Dropdown button content.
    let btnHTML = headerFn(sideNav);
    if (!sideNav) {
      // On desktop mode, it renders as a dropdown.
      // Hook up dropdown events.
      btnHTML = html`<a href="#" @click=${(e: Event) => this.setupDropdownBtnEvents(e, dropdownID)}>
        ${btnHTML}
      </a>`;
    }
    btnHTML = html`<div class=${`${btnCls} ${btnCls}-${dropdownID}`}>
        ${btnHTML} ${when(!sideNav, () => dropdownFn(false))}
      </div>
      ${when(sideNav, () => dropdownFn(true))}`;
    return btnHTML;
  }

  private renderThemeMenuItem(sideNav: boolean) {
    return this.renderMenuItem(
      themeDropdownID,
      sideNav,
      (sn) => this.renderThemeHeader(sn),
      (sn) => this.renderThemeDropdown(sn),
    );
  }

  private renderThemeHeader(sideNav: boolean) {
    const { curTheme } = this;
    const themeText = thm.textMap.get(curTheme) || '';
    const themeIcon = staticMainImage(thm.iconMap.get(curTheme) || '');

    return sideNav
      ? html`${ls.theme}`
      : html`<svg-icon title=${themeText} src=${themeIcon} .size=${imgSize}></svg-icon>`;
  }

  protected getDropdownContentCls(sideNav: boolean, dropdownID: string) {
    return classMap({
      [dropdownCls]: !sideNav,
      'd-block': this.curOpenDropdown === dropdownID,
    });
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
      <svg-icon src=${staticMainImage(icon)} .size=${imgSize}></svg-icon>
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
    this.closeCurDropdown();
    this.closeSideNav(null);
    if (this.curTheme === theme) {
      return;
    }
    this.applyTheme(theme);
  }

  private renderThemeDropdown(sideNav: boolean) {
    return html`
      <div class=${this.getDropdownContentCls(sideNav, themeDropdownID)}>
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

  protected setupDropdownBtnEvents(e: Event, dropdownID: string) {
    e.preventDefault();
    // Stop propagation so that this click event is not captured by `showMenu`.
    e.stopPropagation();

    if (this.curOpenDropdown === dropdownID) {
      // Close the open dropdown.
      this.closeCurDropdown();
    } else if (this.curOpenDropdown) {
      // Switch to another dropdown.
      this.curOpenDropdown = dropdownID;
    } else {
      // Open the specified dropdown.
      this.showDropdown(dropdownID);
    }
  }

  private showDropdown(dropdownID: string) {
    // Listen for doc events to close the dropdown if necessary.
    document.addEventListener('click', this.handleDocumentClicksForDropdowns, { once: true });
    this.handleEsc(() => this.closeCurDropdown());
    this.curOpenDropdown = dropdownID;
  }

  private closeCurDropdown() {
    if (!this.curOpenDropdown) {
      return;
    }
    document.removeEventListener('click', this.handleDocumentClicksForDropdowns);
    this.curOpenDropdown = undefined;
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
  handleDocumentClicksForDropdowns = () => {
    // Any clicks will cause the dropdown to hide including the ones from the dropdown itself.
    // For example, clicking "New post" triggers an overlay, the dropdown must disappear after
    // the click.
    this.closeCurDropdown();
  };
}
