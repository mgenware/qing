/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, state } from 'll.js';
import 'ui/forms/inputView';
import 'ui/forms/enterKeyHandler';
import 'ui/forms/inputErrorView';
import { appDef } from '@qing/def';
import appTask from 'app/appTask.js';
import * as pu from 'lib/pageUtil.js';
import * as pubAuth from '@qing/routes/s/pub/auth.js';
import ResetPwdLoader from './loaders/resetPwdLoader.js';

@customElement('reset-pwd-app')
export class ResetPwdApp extends BaseElement {
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

  @state() private password = '';
  @state() private confirmPassword = '';

  // Additional passwords mismatch error message displayed under "Confirm password" input.
  @state() private passwordsMismatchErr = '';

  override render() {
    return html`
      <enter-key-handler>
        <h2>${globalThis.authLS.resetPwd}</h2>
        <div>
          <input-view
            class="m-t-md"
            required
            type="password"
            minLength=${appDef.lenMinUserPwd}
            maxLength=${appDef.lenMaxUserPwd}
            autocomplete="new-password"
            label=${globalThis.coreLS.password}
            value=${this.password}
            @input-change=${(e: CustomEvent<string>) => (this.password = e.detail)}></input-view>

          <input-view
            class="m-t-md"
            required
            type="password"
            minLength=${appDef.lenMinUserPwd}
            maxLength=${appDef.lenMaxUserPwd}
            autocomplete="new-password"
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
          class="m-t-lg enter-key-responder"
          @click=${this.handleResetClick}
          >${globalThis.coreLS.save}</qing-button
        >
      </enter-key-handler>
    `;
  }

  private validateForm(): boolean {
    if (!this.checkFormValidity(null)) {
      return false;
    }

    // Check if passwords match.
    const pwdMatch = this.password === this.confirmPassword;
    this.passwordsMismatchErr = pwdMatch ? '' : globalThis.coreLS.pwdDontMatch;
    return pwdMatch;
  }

  private async handleResetClick() {
    if (!this.validateForm()) {
      return;
    }
    const loader = new ResetPwdLoader(this.password);
    const status = await appTask.critical(loader, globalThis.coreLS.working);
    if (status.isSuccess) {
      pu.setMainContent(
        html`
          <div>
            <h1>${globalThis.authLS.yourPwdHasBeenReset}</h1>
            <p>
              <qing-button href=${pubAuth.signIn}>${globalThis.coreLS.signIn}</qing-button>
            </p>
          </div>
        `,
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'reset-pwd-app': ResetPwdApp;
  }
}
