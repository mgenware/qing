/*
 *
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, when, state, TemplateResult } from 'll';
import * as mRoute from '@qing/routes/d/m';
import * as mxRoute from '@qing/routes/d/mx';
import * as authRoute from '@qing/routes/d/auth';
import SignOutLoader from './loaders/signOutLoader';
import { User } from 'sod/auth';
import appPageState from 'app/appPageState';
import appState from 'app/appState';
import appStateName from 'app/appStateName';
import appTask from 'app/appTask';
import * as pu from 'lib/pageUtil';
import { appdef } from '@qing/def';
import { runNewEntityCommand } from 'app/appCommands';
import * as core from './navbarAppCore';
import { CHECK } from 'checks';
import { staticMainImage } from 'urls';

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
            appPageState.siteType === appdef.SiteType.forums,
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
