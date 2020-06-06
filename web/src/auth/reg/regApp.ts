import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import ls from 'ls';
import * as lp from 'lit-props';
import app from 'app';
import CreateNewUserLoader from './loaders/createNewUserLoader';
import 'qing-dialog-component';
import 'ui/form/inputView';
import 'ui/form/inputErrorView';

@customElement('reg-app')
export class RegApp extends BaseElement {
  @lp.string private name = '';
  @lp.string private email = '';
  @lp.string private password = '';
  @lp.string private confirmPassword = '';

  @lp.bool private isCompletionModalOpen = false;

  // Additional passwords mismatch error message displayed under "Confirm password" input.
  @lp.string private passwordsMismatchErr = '';

  render() {
    return html`
      <h2>${ls.createAnAcc}</h2>
      <div>
        <input-view
          required
          label=${ls.name}
          value=${this.name}
          @onChange=${(e: CustomEvent<string>) => (this.name = e.detail)}
        ></input-view>

        <input-view
          required
          type="email"
          label=${ls.email}
          value=${this.email}
          @onChange=${(e: CustomEvent<string>) => (this.email = e.detail)}
        ></input-view>

        <input-view
          required
          type="password"
          label=${ls.password}
          value=${this.password}
          @onChange=${(e: CustomEvent<string>) => (this.password = e.detail)}
        ></input-view>

        <input-view
          required
          type="password"
          label=${ls.confirmPassword}
          value=${this.confirmPassword}
          @onChange=${(e: CustomEvent<string>) =>
            (this.confirmPassword = e.detail)}
        ></input-view>

        <input-error-view
          message=${this.passwordsMismatchErr}
        ></input-error-view>
      </div>
      <qing-button btnStyle="success" @click=${this.handleSignUpClick}
        >${ls.signUp}</qing-button
      >
      <qing-dialog
        id="modalElement"
        .isOpen=${this.isCompletionModalOpen}
        .buttons=${[ls.goToYourEmail]}
        @closed=${this.handleGoToYourEmail}
      >
        <div>
          <h2>${ls.regEmailSentTitle}</h2>
          <p>${ls.regEmailSentContent}</p>
        </div>
      </qing-dialog>
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
    const loader = new CreateNewUserLoader(
      this.name,
      this.email,
      this.password,
    );
    const status = await app.runGlobalActionAsync(loader, ls.publishing);
    if (status.data) {
      this.isCompletionModalOpen = true;
    }
  }

  private handleGoToYourEmail() {
    const domain = this.email.split('@').pop();
    if (domain) {
      app.browser.openWindow(domain);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'reg-app': RegApp;
  }
}
