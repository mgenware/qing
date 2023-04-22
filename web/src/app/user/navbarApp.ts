/*
 *
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, when, state, TemplateResult } from 'll.js';
import * as mRoute from '@qing/routes/m.js';
import * as mxRoute from '@qing/routes/mx.js';
import * as authRoute from '@qing/routes/auth.js';
import SignOutLoader from './loaders/signOutLoader.js';
import { User } from 'sod/auth.js';
import appPageState from 'app/appPageState.js';
import appState from 'app/appState.js';
import appStateName from 'app/appStateName.js';
import appTask from 'app/appTask.js';
import * as pu from 'lib/pageUtil.js';
import { appdef } from '@qing/def';
import { runNewEntityCommand } from 'app/appCommands.js';
import * as core from './navbarAppCore.js';
import { CHECK } from 'checks.js';
import { staticMainImage } from 'urls.js';

const avatarImgCls = 'avatar-s vertical-align-middle';
const userDropdownID = 'user';

@customElement('navbar-app')
export default class NavbarApp extends core.NavbarAppCore {
  @state() user = appPageState.user;

  override firstUpdated() {
    super.firstUpdated();

    appState.observe(appStateName.user, (arg) => {
      this.user = arg as User;
    });
  }

  protected override renderCustomMenus(sideNav: boolean): TemplateResult | null {
    const { user } = this;
    if (!user) {
      return html`
        <a href=${authRoute.signIn}>${globalThis.coreLS.signIn}</a>
        <a href=${authRoute.signUp}>${globalThis.coreLS.signUp}</a>
      `;
    }
    return this.renderUserMenuItem(sideNav);
  }

  protected override getSiteName(): string {
    return globalThis.coreLS.qingSiteName;
  }

  protected override getSiteIconSrc(): string {
    return staticMainImage('qing.svg');
  }

  private renderUserMenuItem(sideNav: boolean) {
    return this.renderMenuItem(
      userDropdownID,
      sideNav,
      (sn) => this.renderUserHeader(sn),
      (sn) => this.renderUserDropdown(sn),
    );
  }

  private renderUserHeader(sideNav: boolean) {
    const { user } = this;
    CHECK(user);
    return html`<img
        alt=${user.name}
        src=${user.iconURL}
        width=${core.imgSize}
        height=${core.imgSize}
        class=${avatarImgCls} />
      <span class="m-l-sm vertical-align-middle"
        >${user.name}&nbsp;&nbsp;${sideNav ? '' : html`&#x25BE;`}</span
      >`;
  }

  private renderUserDropdown(sideNav: boolean) {
    const { user } = this;
    CHECK(user);
    return html`
      <div class=${this.getDropdownContentCls(sideNav, userDropdownID)}>
        <div class="list">
          <a href=${user.link}>${globalThis.coreLS.profile}</a>
          <a href=${mRoute.yourPosts}>${globalThis.coreLS.yourPosts}</a>
          ${when(
            appPageState.forums,
            () => html`<a href=${mRoute.yourFPosts}>${globalThis.coreLS.yourFPosts}</a>`,
          )}
          <hr />
          <a
            href="#"
            @click=${(e: Event) => this.handleNewPostClick(e, appdef.ContentBaseType.post)}
            >${globalThis.coreLS.newPost}</a
          >
          <hr />
          <a href=${mRoute.profileSettings}>${globalThis.coreLS.settings}</a>
          ${when(
            user.admin,
            () => html`<a href=${mxRoute.general}>${globalThis.coreLS.siteSettings}</a>`,
          )}
          <a href="#" @click=${this.handleSignOutClick}>${globalThis.coreLS.signOut}</a>
        </div>
      </div>
    `;
  }

  private handleNewPostClick(e: Event, entityType: number) {
    e.preventDefault();
    runNewEntityCommand(entityType, null);
  }

  private async handleSignOutClick(e: Event) {
    e.preventDefault();
    const loader = new SignOutLoader();
    const res = await appTask.critical(loader);
    if (res.isSuccess) {
      pu.reload();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'navbar-app': NavbarApp;
  }
}
