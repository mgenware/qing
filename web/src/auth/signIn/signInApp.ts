/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import 'com/cmt/cmtApp';
import ls from 'ls';
import SignInLoader from './loaders/signInLoader';
import 'ui/forms/inputView';
import 'ui/forms/enterKeyHandler';
import 'ui/forms/inputErrorView';
import appTask from 'app/appTask';
import * as pu from 'app/utils/pageUtils';

@customElement('sign-in-app')
export class SignInApp extends BaseElement {
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

  @property() private email = '';
  @property() private password = '';

  override render() {
    return html`
      <enter-key-handler>
        <h2>${ls.signIn}</h2>
        <div>
          <input-view
            required
            type="email"
            .autocomplete=${'email'}
            .inputmode=${'email'}
            label=${ls.email}
            value=${this.email}
            @input-change=${(e: CustomEvent<string>) => (this.email = e.detail)}></input-view>

          <input-view
            class="m-t-md"
            required
            type="password"
            .autocomplete=${'current-password'}
            label=${ls.password}
            value=${this.password}
            @input-change=${(e: CustomEvent<string>) => (this.password = e.detail)}></input-view>
        </div>
        <qing-button
          btnStyle="success"
          class="m-t-md enter-key-responder"
          @click=${this.handleSignInClick}
          >${ls.signIn}</qing-button
        >
      </enter-key-handler>
    `;
  }

  private validateForm(): boolean {
    if (!this.checkFormValidity()) {
      return false;
    }
    return true;
  }

  private async handleSignInClick() {
    if (!this.validateForm()) {
      return;
    }
    const loader = new SignInLoader(this.email, this.password);
    const status = await appTask.critical(loader, ls.working);
    if (status.isSuccess) {
      pu.setURL('/');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sign-in-app': SignInApp;
  }
}
