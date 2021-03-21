/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import 'com/cmt/cmtApp';
import ls from 'ls';
import * as lp from 'lit-props';
import app from 'app';
import SignInLoader from './loaders/signInLoader';
import 'ui/form/inputView';
import 'ui/form/inputErrorView';

@customElement('sign-in-app')
export class SignInApp extends BaseElement {
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

  @lp.string private email = '';
  @lp.string private password = '';

  render() {
    return html`
      <h2>${ls.createAnAcc}</h2>
      <div>
        <input-view
          required
          type="email"
          label=${ls.email}
          value=${this.email}
          @onChange=${(e: CustomEvent<string>) => (this.email = e.detail)}
        ></input-view>

        <input-view
          class="m-t-md"
          required
          type="password"
          label=${ls.password}
          value=${this.password}
          @onChange=${(e: CustomEvent<string>) => (this.password = e.detail)}
        ></input-view>
      </div>
      <qing-button btnStyle="success" class="m-t-md" @click=${this.handleSignInClick}
        >${ls.signIn}</qing-button
      >
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
    const status = await app.runGlobalActionAsync(loader, ls.publishing);
    if (status.isSuccess) {
      app.page.setURL('/');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sign-in-app': SignInApp;
  }
}
