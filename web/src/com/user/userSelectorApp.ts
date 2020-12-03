import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'ui/form/inputView';
import 'ui/form/selectionView';
import ls from 'ls';
import 'ui/content/noticeView';
import UserInfo from './userInfo';
import 'ui/status/statusOverlay';
import LoadingStatus from 'lib/loadingStatus';
import FindUsersLoader from './loaders/findUsersLoader';
import { SelectionViewItemEvent } from 'ui/form/selectionView';
import app from 'app';

@customElement('user-selector-app')
export class UserSelectorApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }

        .list-view {
          max-height: 300px;
          overflow-y: auto;
        }
      `,
    ];
  }

  @lp.bool byID = true;
  @lp.string value = '';
  @lp.array private users: UserInfo[] = [];
  @lp.object private status = LoadingStatus.empty;

  render() {
    const { users } = this;
    return html`
      <div>${ls.findUsersByColon}</div>
      <div>
        <selection-view
          .dataSource=${[{ text: ls.userID, selected: true }, { text: ls.name }]}
          @onSelectionChange=${this.handleByIDSelectionChange}
        ></selection-view>
      </div>
      <input-view
        required
        value=${this.value}
        debounceOnChange
        @onChange=${this.handleValueChange}
        @onChangeDebounced=${this.handleValueChangeDebounced}
      ></input-view>
      <status-overlay .status=${this.status}>
        <div class="list-view">
          ${users.length
            ? users.map((item) => this.renderUserRow(item))
            : html`<notice-view>${ls.noResultsFound}</notice-view>`}
        </div>
      </status-overlay>
    `;
  }

  private renderUserRow(user: UserInfo) {
    return html`
      <div>
        <img src=${user.iconURL} class="avatar-m vertical-align-middle" width="25" height="25" />
        <span class="m-l-md">${user.name}</span>
      </div>
    `;
  }

  private handleByIDSelectionChange(e: SelectionViewItemEvent) {
    this.byID = e.index === 0;
  }

  private handleValueChange(e: CustomEvent<string>) {
    this.value = e.detail;
  }

  private async handleValueChangeDebounced() {
    const { value } = this;
    if (!value) {
      return;
    }
    const loader = new FindUsersLoader(this.byID, value);
    const res = await app.runLocalActionAsync(loader, (st) => (this.status = st));
    if (res.data) {
      this.users = res.data;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-selector-app': UserSelectorApp;
  }
}
