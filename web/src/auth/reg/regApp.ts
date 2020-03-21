import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import ls from 'ls';
import 'lit-button';
import * as lp from 'lit-props';

@customElement('reg-app')
export class RegApp extends BaseElement {
  @lp.string private email = '';
  @lp.string private password = '';
  @lp.string private confirmPassword = '';

  render() {
    return html`
      <h2>${ls.createAnAcc}</h2>
      <div class="form">
        <label for="email-input">${ls.email}</label>
        <input
          id="email-input"
          type="text"
          value=${this.email}
          @input=${(e: any) => (this.email = e.target.value)}
        />
        <label for="password-input">${ls.password}</label>
        <input
          id="password-input"
          type="password"
          value=${this.password}
          @input=${(e: any) => (this.password = e.target.value)}
        />
        <label for="confirm-password-input">${ls.password}</label>
        <input
          id="confirm-password-input"
          type="password"
          value=${this.confirmPassword}
          @input=${(e: any) => (this.confirmPassword = e.target.value)}
        />
      </div>
      <lit-button class="is-success">${ls.signUp}</lit-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'reg-app': RegApp;
  }
}
