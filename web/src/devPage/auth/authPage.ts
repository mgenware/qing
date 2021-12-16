/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import 'ui/form/inputView';
import 'ui/form/selectionView';
import 'qing-button';
import * as loaders from './loaders';
import appTask from 'app/appTask';
import { SelectionViewItemEvent } from 'ui/form/selectionView';

@customElement('auth-page')
export class AuthDevPage extends BaseElement {
  static get styles() {
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

  @lp.string uidStr = '10';
  @lp.bool newUserAdmin = false;
  @lp.bool isUidString = false;

  render() {
    return html`
      <div>
        <h1>Auth dev page</h1>
        <hr />
        ${this.renderUserSection()}
      </div>
    `;
  }

  private renderUserSection() {
    const { isUidString } = this;
    return html`
      <div>
        <p>
          <selection-view
            class="m-t-md"
            @selectionChanged=${this.handleUIDTypeChange}
            .dataSource=${[
              { text: 'Unsigned number', checked: !isUidString },
              { text: 'Encoded string', checked: isUidString },
            ]}></selection-view>
        </p>
        <input-view
          required
          label="UID"
          value=${this.uidStr}
          @onChange=${(e: CustomEvent<string>) => (this.uidStr = e.detail)}>
        </input-view>
        <p>
          <qing-button @click=${this.handleSignIn}>Sign in</qing-button>
        </p>
        <p>
          <qing-button @click=${this.handleNewUser}>New user</qing-button
          ><qing-button @click=${this.handleGetInfo}>Get info</qing-button>
        </p>
      </div>
    `;
  }

  private handleUIDTypeChange(e: CustomEvent<SelectionViewItemEvent>) {
    this.isUidString = e.detail.index !== 0;
  }

  private async handleSignIn() {
    if (!this.uidStr) {
      return;
    }
    const loader = new loaders.InLoader(this.uidStr, this.isUidString);
    const status = await appTask.critical(loader);
    if (status.isSuccess) {
      window.location.href = '/';
    }
  }

  private async handleNewUser() {
    const loader = new loaders.NewUserLoader();
    const status = await appTask.critical(loader);
    if (status.data) {
      // eslint-disable-next-line no-alert
      alert(`New user created with ID ${JSON.stringify(status.data)}`);
    }
  }

  private async handleGetInfo() {
    const loader = new loaders.InfoLoader(this.uidStr);
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
