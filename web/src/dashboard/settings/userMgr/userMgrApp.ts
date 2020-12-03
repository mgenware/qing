import { customElement, css, html } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import LoadingStatus from 'lib/loadingStatus';
import ls from 'ls';
// Views.
import 'ui/com/sectionView';
import 'ui/com/statusOverlay';
import 'ui/com/tagView';
import GetAdminsLoader from './loaders/getAdminsLoader';
import UserInfo from 'com/user/userInfo';
import app from 'app';

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
  private getAdminLoader = new GetAdminsLoader();
  // TODO: Pagination.
  private admins: UserInfo[] = [];

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
      </status-overlay>
    `;
  }

  private renderAdmins() {
    const { admins } = this;
    if (!admins.length) {
      return html`<no-content-view></no-content-view>`;
    }
    return html`<div class="app-table-container m-t-md">
      <table class="app-table">
        <thead>
          <th>${ls.name}</th>
        </thead>
        <tbody>
          ${admins.map(
            (item) => html`
              <tr>
                <td>${this.renderUserRow(item)}</td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    </div>`;
  }

  private renderUserRow(user: UserInfo) {
    return html`
      <a href=${user.url}>
        <img src=${user.iconURL} class="avatar-m" width="50" height="50" />
      </a>
      <a class="m-l-md" href=${user.url}>${user.name}</a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-mgr-app': UserMgrApp;
  }
}
