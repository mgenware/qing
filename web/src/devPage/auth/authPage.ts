/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, state } from 'll.js';
import 'ui/forms/inputView';
import * as authRoute from '@qing/routes/dev/auth.js';
import 'qing-button';
import * as loaders from './loaders.js';
import appTask from 'app/appTask.js';
import 'ui/forms/checkList.js';
import { CheckListChangeArgs, CheckListItem } from 'ui/forms/checkList.js';

enum UserIDType {
  raw,
  encoded,
}

const userIDTypeChecklist: CheckListItem[] = [
  { key: UserIDType.raw, text: 'Raw' },
  { key: UserIDType.encoded, text: 'Encoded' },
];

@customElement('auth-page')
export class AuthDevPage extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        p qing-button {
          margin-right: 1rem;
        }
      `,
    ];
  }

  get isEID() {
    return this.uidTypeSelection === UserIDType.encoded;
  }

  @state() uidStr = '';
  @state() newUserAdmin = false;
  @state() uidTypeSelection = UserIDType.raw;

  override render() {
    return html`
      <div>
        <h1>Auth</h1>
        <hr />
        ${this.renderAuthSection()}
        <h2>Account verified page</h2>
        <p><a href=${authRoute.accVerified}>Link</a></p>
      </div>
    `;
  }

  private renderAuthSection() {
    return html`
      <div class="br-user">
        <check-list
          class="m-t-md"
          @checklist-change=${this.handleUIDTypeChange}
          .selectedItems=${[this.uidTypeSelection]}
          .items=${userIDTypeChecklist}></check-list>
        <input-view
          required
          label="UID"
          class="m-t-md"
          value=${this.uidStr}
          @input-change=${(e: CustomEvent<string>) => (this.uidStr = e.detail)}>
        </input-view>
        <p>
          <qing-button @click=${this.handleSignIn}>Sign in</qing-button>
        </p>
        <p>
          <qing-button @click=${this.handleNewUser}>New user</qing-button>
          <qing-button @click=${this.handleGetInfo}>Fetch info</qing-button>
          <qing-button @click=${this.handleCurUser}>Current user</qing-button>
        </p>
      </div>
    `;
  }

  private handleUIDTypeChange(e: CustomEvent<CheckListChangeArgs>) {
    this.uidTypeSelection = e.detail.selectedItem();
  }

  private async handleSignIn() {
    if (!this.uidStr) {
      return;
    }
    const loader = new loaders.InLoader(this.uidStr, this.isEID);
    const status = await appTask.critical(loader);
    if (status.isSuccess) {
      window.location.href = '/';
    }
  }

  private async handleNewUser() {
    const loader = new loaders.NewUserLoader();
    const status = await appTask.critical(loader);
    if (status.isSuccess) {
      // eslint-disable-next-line no-alert
      alert(`New user created with ID ${JSON.stringify(status.data)}`);
    }
  }

  private async handleGetInfo() {
    const loader = new loaders.InfoLoader(this.uidStr, this.isEID);
    const status = await appTask.critical(loader);
    if (status.isSuccess) {
      // eslint-disable-next-line no-alert
      alert(JSON.stringify(status.data));
    }
  }

  private async handleCurUser() {
    const loader = new loaders.CurUserLoader();
    const status = await appTask.critical(loader);
    if (status.isSuccess) {
      // eslint-disable-next-line no-alert
      alert(JSON.stringify(status.data));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'auth-page': AuthDevPage;
  }
}
