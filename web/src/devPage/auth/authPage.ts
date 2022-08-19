/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import 'ui/forms/inputView';
import 'ui/forms/checklistView';
import * as authRoute from '@qing/routes/d/dev/auth';
import 'qing-button';
import * as loaders from './loaders';
import appTask from 'app/appTask';

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

  @property() uidStr = '';
  @property({ type: Boolean }) newUserAdmin = false;
  @property({ type: Boolean }) isEID = false;

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
        <p>
          <checklist-view
            class="m-t-md"
            @checklist-change=${this.handleUIDTypeChange}
            .selectedIndices=${[+this.isEID]}
            .dataSource=${['Raw', 'Encoded']}></checklist-view>
        </p>
        <input-view
          required
          label="UID"
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

  private handleUIDTypeChange(e: CustomEvent<number[]>) {
    this.isEID = !!e.detail[0];
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
