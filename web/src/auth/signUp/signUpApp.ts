/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import 'com/cmt/cmtApp';
import SignUpLoader from './loaders/SignUpLoader';
import 'qing-overlay';
import 'ui/forms/inputView';
import 'ui/forms/enterKeyHandler';
import 'ui/forms/inputErrorView';
import { appdef } from '@qing/def';
import appTask from 'app/appTask';
import * as pu from 'lib/pageUtil';

@customElement('sign-up-app')
export class SignUpApp extends BaseElement {
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

  @property() private userName = '';
  @property() private email = '';
  @property() private password = '';
  @property() private confirmPassword = '';

  // Additional passwords mismatch error message displayed under "Confirm password" input.
  @property() private passwordsMismatchErr = '';

  override render() {
    return html`
      <enter-key-handler>
        <h2>${globalThis.coreLS.createAnAcc}</h2>
        <div>
          <input-view
            class="m-t-md"
            required
            label=${globalThis.coreLS.name}
            value=${this.userName}
            @input-change=${(e: CustomEvent<string>) => (this.userName = e.detail)}></input-view>

          <input-view
            class="m-t-md"
            required
            autocomplete="email"
            inputmode="email"
            type="email"
            label=${globalThis.coreLS.email}
            value=${this.email}
            @input-change=${(e: CustomEvent<string>) => (this.email = e.detail)}></input-view>

          <input-view
            class="m-t-md"
            required
            type="password"
            minLength=${appdef.lenMinUserPwd}
            maxLength=${appdef.lenMaxUserPwd}
            autocomplete="new-password"
            label=${globalThis.coreLS.password}
            value=${this.password}
            @input-change=${(e: CustomEvent<string>) => (this.password = e.detail)}></input-view>

          <input-view
            class="m-t-md"
            required
            type="password"
            minLength=${appdef.lenMinUserPwd}
            maxLength=${appdef.lenMaxUserPwd}
            autocomplete=${'new-password'}
            label=${globalThis.coreLS.confirmPassword}
            value=${this.confirmPassword}
            @input-change=${(e: CustomEvent<string>) =>
              (this.confirmPassword = e.detail)}></input-view>
          ${this.passwordsMismatchErr
            ? html`<input-error-view message=${this.passwordsMismatchErr}></input-error-view>`
            : ''}
        </div>
        <qing-button
          btnStyle="success"
          class="m-t-sm enter-key-responder"
          @click=${this.handleSignUpClick}
          >${globalThis.coreLS.signUp}</qing-button
        >
      </enter-key-handler>
    `;
  }

  private validateForm(): boolean {
    if (!this.checkFormValidity()) {
      return false;
    }

    // Check if passwords match.
    const pwdMatch = this.password === this.confirmPassword;
    this.passwordsMismatchErr = pwdMatch ? '' : globalThis.coreLS.pwdDontMatch;
    return pwdMatch;
  }

  private async handleSignUpClick() {
    if (!this.validateForm()) {
      return;
    }
    const loader = new SignUpLoader(this.userName, this.email, this.password);
    const status = await appTask.critical(loader, globalThis.coreLS.publishing);
    if (status.isSuccess) {
      pu.setTitleAndMainContent(
        [globalThis.coreLS.regEmailSentDialogTitle],
        html`
          <div>
            <h1>${globalThis.coreLS.regEmailSentDialogTitle}</h1>
            <p>${globalThis.coreLS.regEmailSentDialogContent}</p>
          </div>
        `,
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sign-up-app': SignUpApp;
  }
}
