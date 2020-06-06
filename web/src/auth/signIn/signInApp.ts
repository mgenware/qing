import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import ls from 'ls';
import * as lp from 'lit-props';
import app from 'app';
import SignInLoader from './loaders/signInLoader';
import 'qing-dialog-component';
import 'ui/form/inputView';
import 'ui/form/inputErrorView';

@customElement('sign-in-app')
export class SignInApp extends BaseElement {
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
          required
          type="password"
          label=${ls.password}
          value=${this.password}
          @onChange=${(e: CustomEvent<string>) => (this.password = e.detail)}
        ></input-view>
      </div>
      <qing-button btnStyle="success" @click=${this.handleSignInClick}
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
      app.browser.setURL('/');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sign-in-app': SignInApp;
  }
}
