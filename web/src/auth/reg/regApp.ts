import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import ls from 'ls';
import 'lit-button';
import * as lp from 'lit-props';
import app from 'app';
import CreateNewUserLoader from './loaders/createNewUserLoader';
import 'qing-dialog-component';

@customElement('reg-app')
export class RegApp extends BaseElement {
  @lp.string private name = '';
  @lp.string private email = '';
  @lp.string private password = '';
  @lp.string private confirmPassword = '';

  @lp.bool private isCompletionModalOpen = false;

  render() {
    return html`
      <h2>${ls.createAnAcc}</h2>
      <div class="form">
        <label for="name-input">${ls.name}</label>
        <input
          id="name-input"
          type="text"
          value=${this.name}
          @change=${(e: any) => (this.name = e.target.value)}
        />
        <label for="email-input">${ls.email}</label>
        <input
          id="email-input"
          type="text"
          value=${this.email}
          @change=${(e: any) => (this.email = e.target.value)}
        />
        <label for="password-input">${ls.password}</label>
        <input
          id="password-input"
          type="password"
          value=${this.password}
          @change=${(e: any) => (this.password = e.target.value)}
        />
        <label for="confirm-password-input">${ls.password}</label>
        <input
          id="confirm-password-input"
          type="password"
          value=${this.confirmPassword}
          @change=${(e: any) => (this.confirmPassword = e.target.value)}
        />
      </div>
      <lit-button class="is-success" @click=${this.handleSignUpClick}
        >${ls.signUp}</lit-button
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

  private async handleSignUpClick() {
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
