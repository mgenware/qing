import { customElement, css, html } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';
import ls, { formatLS } from 'ls';
import 'ui/content/sectionView';
import 'ui/status/statusOverlay';
import 'ui/content/tagView';
import 'ui/buttons/linkButton';
import 'ui/content/noticeView';
import 'com/user/userSelectorApp';
import GetAdminsLoader from './loaders/getAdminsLoader';
import UserInfo from 'com/user/userInfo';
import app from 'app';
import SetAdminLoader from './loaders/setAdminLoader';
import { skipItem } from 'lib/arrayUtils';

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

  private getAdminLoader = new GetAdminsLoader();

  async firstUpdated() {
    const res = await app.runLocalActionAsync(
      this.getAdminLoader,
      (st) => (this.adminSectionStatus = st),
    );
    if (res.data) {
      this.admins = res.data;
    }
  }

  render() {
    return html`
      <status-overlay .status=${this.adminSectionStatus}>
        <section-view sectionStyle="info">
          <span>${ls.adminAccounts}</span>
          <tag-view tagStyle="warning">${ls.featureOnlyAvailableToAdmins}</tag-view>
        </section-view>
        ${this.renderAdmins()}
        <h2>${ls.addAnAdmin}</h2>
        <user-selector-app></user-selector-app>
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
    const thisIsYou = app.state.userID === user.eid;
    return html`
      <tr>
        <td>
          <a href=${user.url} target="_blank">
            <img
              src=${user.iconURL}
              class="avatar-m vertical-align-middle"
              width="25"
              height="25"
            />
            <span class="m-l-md">${user.name}</span>
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
    const ok = await app.alert.confirm(formatLS(ls.removeAdminConfirmation, user.name));
    if (!ok) {
      return;
    }
    const loader = new SetAdminLoader(user.eid, false);
    const res = await app.runGlobalActionAsync(loader);
    if (res.isSuccess) {
      this.admins = skipItem(this.admins, user);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-mgr-app': UserMgrApp;
  }
}
