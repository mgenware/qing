/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css, html, BaseElement, lp } from 'll';
import LoadingStatus from 'lib/loadingStatus';
import ls, { formatLS } from 'ls';
import 'ui/content/headingView';
import 'ui/content/subheadingView';
import 'ui/status/statusOverlay';
import 'ui/widgets/tagView';
import 'ui/buttons/linkButton';
import 'ui/alerts/noticeView';
import 'com/user/userSelectorApp';
import GetAdminsLoader from './loaders/getAdminsLoader';
import UserInfo from 'com/user/userInfo';
import SetAdminLoader from './loaders/setAdminLoader';
import 'com/user/userCard';
import { tif } from 'lib/htmlLib';
import appPageState from 'app/appPageState';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';

@customElement('user-mgr-app')
export class UserMgrApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @lp.bool adminSectionStatus = LoadingStatus.working;
  // TODO: Pagination.
  @lp.array private admins: UserInfo[] = [];
  @lp.object private userCandidate: UserInfo | null = null;

  private getAdminLoader = new GetAdminsLoader();

  async firstUpdated() {
    const res = await appTask.local(this.getAdminLoader, (st) => (this.adminSectionStatus = st));
    if (res.data) {
      this.admins = res.data;
    }
  }

  render() {
    return html`
      <status-overlay .status=${this.adminSectionStatus}>
        <heading-view>${ls.adminAccounts}</heading-view>
        ${this.renderAdmins()}
        <subheading-view class="m-t-lg">${ls.addAnAdmin}</subheading-view>
        <user-selector-app
          @selectionChanged=${(e: CustomEvent<UserInfo | null>) => (this.userCandidate = e.detail)}
        ></user-selector-app>
        ${tif(
          this.userCandidate,
          html` <qing-button btnStyle="success" class="m-t-md" @click=${this.handleAddAdmin}>
            ${ls.add}
          </qing-button>`,
        )}
      </status-overlay>
    `;
  }

  private renderAdmins() {
    const { admins } = this;
    if (!admins.length) {
      return html`<notice-view>${ls.noContentAvailable}</notice-view>`;
    }
    return html`<div class="app-table-container m-t-md">
      <table class="app-table">
        <thead>
          <th>${ls.name}</th>
          <th>${ls.actions}</th>
        </thead>
        <tbody>
          ${admins.map((item) => this.renderUserRow(item))}
        </tbody>
      </table>
    </div>`;
  }

  private renderUserRow(user: UserInfo) {
    const thisIsYou = appPageState.userEID === user.eid;
    return html`
      <tr>
        <td>
          <a href=${user.url} target="_blank">
            <user-card .user=${user}></user-card>
          </a>
        </td>
        <td>
          ${thisIsYou
            ? html`<tag-view tagStyle="warning">${ls.thisIsYou}</tag-view>`
            : html`<link-button @click=${() => this.handleRemoveAdmin(user)}
                >${ls.removeAdmin}</link-button
              >`}
        </td>
      </tr>
    `;
  }

  private async handleRemoveAdmin(user: UserInfo) {
    const ok = await appAlert.confirm(ls.warning, formatLS(ls.removeAdminConfirmation, user.name));
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
      ls.warning,
      formatLS(ls.confirmAddUserAsAdmin, userCandidate.name),
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
    'user-mgr-app': UserMgrApp;
  }
}
