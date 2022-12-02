/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, when, property } from 'll';
import 'ui/content/headingView';
import 'ui/content/subheadingView';
import 'ui/widgets/tagView';
import 'ui/buttons/linkButton';
import 'ui/alerts/noticeView';
import 'com/user/userSelectorApp';
import GetAdminsLoader from './loaders/getAdminsLoader';
import UserInfo from 'com/user/userInfo';
import SetAdminLoader from './loaders/setAdminLoader';
import 'com/user/userCard';
import appPageState from 'app/appPageState';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';
import 'ui/status/statefulPage';
import { StatefulPage } from 'ui/status/statefulPage';
import strf from 'bowhead-js';

@customElement('site-admin-st')
export class SiteAdminST extends StatefulPage {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  // TODO: Pagination.
  @property({ type: Array }) private admins: readonly UserInfo[] = [];
  @property({ type: Object }) private userCandidate: UserInfo | null = null;

  override async reloadStatefulPageDataAsync() {
    const loader = new GetAdminsLoader();
    const res = await appTask.local(loader, (st) => (this.loadingStatus = st));
    if (res.data) {
      this.admins = res.data;
    }
  }

  override renderContent() {
    return html`
      <div>
        <heading-view>${globalThis.coreLS.adminAccounts}</heading-view>
        ${this.renderAdmins()}
        <subheading-view class="m-t-lg">${globalThis.coreLS.addAnAdmin}</subheading-view>
        <user-selector-app
          @user-selector-change=${(e: CustomEvent<UserInfo | null>) =>
            (this.userCandidate = e.detail)}></user-selector-app>
        ${when(
          this.userCandidate,
          () => html` <qing-button btnStyle="success" class="m-t-md" @click=${this.handleAddAdmin}>
            ${globalThis.coreLS.add}
          </qing-button>`,
        )}
      </div>
    `;
  }

  private renderAdmins() {
    const { admins } = this;
    if (!admins.length) {
      return html`<notice-view>${globalThis.coreLS.noContentAvailable}</notice-view>`;
    }
    return html`<div class="app-table-container m-t-md">
      <table class="app-table">
        <thead>
          <th>${globalThis.coreLS.name}</th>
          <th>${globalThis.coreLS.actions}</th>
        </thead>
        <tbody>
          ${admins.map((item) => this.renderUserRow(item))}
        </tbody>
      </table>
    </div>`;
  }

  private renderUserRow(user: UserInfo) {
    const thisIsYou = appPageState.userID === user.eid;
    return html`
      <tr>
        <td>
          <a href=${user.link} target="_blank">
            <user-card .user=${user}></user-card>
          </a>
        </td>
        <td>
          ${thisIsYou
            ? html`<tag-view tagStyle="warning">${globalThis.coreLS.thisIsYou}</tag-view>`
            : html`<link-button @click=${() => this.handleRemoveAdmin(user)}
                >${globalThis.coreLS.removeAdmin}</link-button
              >`}
        </td>
      </tr>
    `;
  }

  private async handleRemoveAdmin(user: UserInfo) {
    const ok = await appAlert.confirm(
      globalThis.coreLS.warning,
      strf(globalThis.coreLS.removeAdminConfirmation, user.name),
    );
    if (!ok) {
      return;
    }
    const loader = new SetAdminLoader(user.eid, false);
    const res = await appTask.critical(loader);
    if (res.isSuccess) {
      this.admins = this.admins.filter((ad) => ad !== user);
    }
  }

  private async handleAddAdmin() {
    const { userCandidate } = this;
    if (!userCandidate) {
      return;
    }
    const ok = await appAlert.confirm(
      globalThis.coreLS.warning,
      strf(globalThis.coreLS.confirmAddUserAsAdmin, userCandidate.name),
    );
    if (!ok) {
      return;
    }
    const loader = new SetAdminLoader(userCandidate.eid, true);
    const res = await appTask.critical(loader);
    if (res.isSuccess) {
      this.admins = [...this.admins, userCandidate];
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'site-admin-st': SiteAdminST;
  }
}
