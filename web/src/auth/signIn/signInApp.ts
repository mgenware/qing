/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, state } from 'll.js';
import 'com/cmt/cmtApp';
import SignInLoader from './loaders/signInLoader.js';
import 'ui/forms/inputView';
import 'ui/forms/enterKeyHandler';
import 'ui/forms/inputErrorView';
import appTask from 'app/appTask.js';
import * as pu from 'lib/pageUtil.js';

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

  @state() private email = '';
  @state() private password = '';

  override render() {
    return html`
      <enter-key-handler>
        <h2>${globalThis.coreLS.signIn}</h2>
        <div>
          <input-view
            required
            type="email"
            autocomplete="email"
            inputmode="email"
            label=${globalThis.coreLS.email}
            value=${this.email}
            @input-change=${(e: CustomEvent<string>) => (this.email = e.detail)}></input-view>

          <input-view
            class="m-t-md"
            required
            type="password"
            autocomplete="current-password"
            label=${globalThis.coreLS.password}
            value=${this.password}
            @input-change=${(e: CustomEvent<string>) => (this.password = e.detail)}></input-view>
        </div>
        <qing-button
          btnStyle="success"
          class="m-t-lg enter-key-responder"
          @click=${this.handleSignInClick}
          >${globalThis.coreLS.signIn}</qing-button
        >
      </enter-key-handler>
    `;
  }

  private validateForm(): boolean {
    if (!this.checkFormValidity(null)) {
      return false;
    }
    return true;
  }

  private async handleSignInClick() {
    if (!this.validateForm()) {
      return;
    }
    const loader = new SignInLoader(this.email, this.password);
    const status = await appTask.critical(loader, globalThis.coreLS.working);
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
