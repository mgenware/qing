/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import 'com/cmt/cmtApp';
import ls from 'ls';
import CreateNewUserLoader from './loaders/createNewUserLoader';
import 'qing-overlay';
import 'ui/form/inputView';
import 'ui/form/inputErrorView';
import appTask from 'app/appTask';
import pageUtils from 'app/utils/pageUtils';

@ll.customElement('reg-app')
export class RegApp extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @ll.string private name = '';
  @ll.string private email = '';
  @ll.string private password = '';
  @ll.string private confirmPassword = '';

  @ll.bool private isCompletionModalOpen = false;

  // Additional passwords mismatch error message displayed under "Confirm password" input.
  @ll.string private passwordsMismatchErr = '';

  render() {
    return ll.html`
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
          isEmail
          type="email"
          label=${ls.email}
          value=${this.email}
          @onChange=${(e: CustomEvent<string>) => (this.email = e.detail)}></input-view>

        <input-view
          class="m-t-md"
          required
          type="password"
          label=${ls.password}
          value=${this.password}
          @onChange=${(e: CustomEvent<string>) => (this.password = e.detail)}></input-view>

        <input-view
          class="m-t-md"
          required
          type="password"
          label=${ls.confirmPassword}
          value=${this.confirmPassword}
          @onChange=${(e: CustomEvent<string>) => (this.confirmPassword = e.detail)}></input-view>
        ${
          this.passwordsMismatchErr
            ? ll.html`<input-error-view
              class="m-t-md"
              message=${this.passwordsMismatchErr}></input-error-view>`
            : ''
        }
      </div>
      <qing-button btnStyle="success" class="m-t-md" @click=${this.handleSignUpClick}
        >${ls.signUp}</qing-button
      >
      <qing-overlay
        ?open=${this.isCompletionModalOpen}
        @openChanged=${this.handleCompletionModalOpenChanged}>
        <div>
          <h2>${ls.regEmailSentTitle}</h2>
          <p>${ls.regEmailSentContent}</p>
        </div>
        <p>
          <qing-button>${ls.goToYourEmail}</qing-button>
        </p>
      </qing-overlay>
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
    const loader = new CreateNewUserLoader(this.name, this.email, this.password);
    const status = await appTask.critical(loader, ls.publishing);
    if (status.isSuccess) {
      this.isCompletionModalOpen = true;
    }
  }

  private handleCompletionModalOpenChanged(e: CustomEvent<boolean>) {
    if (!e.detail) {
      const domain = this.email.split('@').pop();
      if (domain) {
        pageUtils.openWindow(domain);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'reg-app': RegApp;
  }
}
