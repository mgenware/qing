/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import 'com/cmt/cmtApp';
import ls from 'ls';
import SignUpLoader from './loaders/SignUpLoader';
import 'qing-overlay';
import 'ui/form/inputView';
import 'ui/form/inputErrorView';
import appTask from 'app/appTask';
import * as pu from 'app/utils/pageUtils';

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

  @property() private name = '';
  @property() private email = '';
  @property() private password = '';
  @property() private confirmPassword = '';

  // Additional passwords mismatch error message displayed under "Confirm password" input.
  @property() private passwordsMismatchErr = '';

  override render() {
    return html`
      <h2>${ls.createAnAcc}</h2>
      <div>
        <input-view
          class="m-t-md"
          required
          label=${ls.name}
          value=${this.name}
          @onChange=${(e: CustomEvent<string>) => (this.name = e.detail)}></input-view>

        <input-view
          class="m-t-md"
          required
          .autocomplete=${'email'}
          .inputmode=${'email'}
          type="email"
          label=${ls.email}
          value=${this.email}
          @onChange=${(e: CustomEvent<string>) => (this.email = e.detail)}></input-view>

        <input-view
          class="m-t-md"
          required
          type="password"
          .autocomplete=${'new-password'}
          label=${ls.password}
          value=${this.password}
          @onChange=${(e: CustomEvent<string>) => (this.password = e.detail)}></input-view>

        <input-view
          class="m-t-md"
          required
          type="password"
          .autocomplete=${'new-password'}
          label=${ls.confirmPassword}
          value=${this.confirmPassword}
          @onChange=${(e: CustomEvent<string>) => (this.confirmPassword = e.detail)}></input-view>
        ${this.passwordsMismatchErr
          ? html`<input-error-view
              class="m-t-md"
              message=${this.passwordsMismatchErr}></input-error-view>`
          : ''}
      </div>
      <qing-button btnStyle="success" class="m-t-md" @click=${this.handleSignUpClick}
        >${ls.signUp}</qing-button
      >
    `;
  }

  private validateForm(): boolean {
    if (!this.checkFormValidity()) {
      return false;
    }

    // Check if passwords match.
    const pwdMatch = this.password === this.confirmPassword;
    this.passwordsMismatchErr = pwdMatch ? '' : ls.pwdDontMatch;
    return pwdMatch;
  }

  private async handleSignUpClick() {
    if (!this.validateForm()) {
      return;
    }
    const loader = new SignUpLoader(this.name, this.email, this.password);
    const status = await appTask.critical(loader, ls.publishing);
    if (status.isSuccess) {
      pu.setTitleAndMainContent(
        [ls.regEmailSentDialogTitle],
        html`
          <div>
            <h1>${ls.regEmailSentDialogTitle}</h1>
            <p>${ls.regEmailSentDialogContent}</p>
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
