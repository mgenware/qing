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
import appTask from 'app/appTask.js';
import * as pu from 'lib/pageUtil.js';
import ForgotPwdLoader from './loaders/forgotPwdLoader.js';

@customElement('forgot-pwd-app')
export class ForgotPwdApp extends BaseElement {
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

  override render() {
    return html`
      <enter-key-handler>
        <h2>${globalThis.authLS.enterYourEmailToReset}</h2>
        <div>
          <input-view
            required
            type="email"
            autocomplete="email"
            inputmode="email"
            label=${globalThis.coreLS.email}
            value=${this.email}
            @input-change=${(e: CustomEvent<string>) => (this.email = e.detail)}></input-view>
        </div>
        <qing-button
          btnStyle="success"
          class="m-t-lg enter-key-responder"
          @click=${this.handleResetClick}
          >${globalThis.coreLS.nextBtn}</qing-button
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

  private async handleResetClick() {
    if (!this.validateForm()) {
      return;
    }
    const loader = new ForgotPwdLoader(this.email);
    const status = await appTask.critical(loader, globalThis.coreLS.working);
    if (status.isSuccess) {
      pu.setMainContent(
        html`
          <div>
            <h1>${globalThis.authLS.verifyEmailSentDialogTitle}</h1>
            <p>${globalThis.authLS.verifyEmailSentDialogTitle}</p>
          </div>
        `,
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'forgot-pwd-app': ForgotPwdApp;
  }
}
