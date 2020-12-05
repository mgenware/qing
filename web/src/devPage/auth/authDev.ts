import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/form/inputView';
import 'qing-button';
import routes from '../devRoutes';

@customElement('auth-dev')
export class AuthDev extends BaseElement {
  @lp.string loginUserID = '10';
  @lp.string newUserID = '';
  @lp.bool newUserAdmin = false;

  render() {
    return html`
      <container-view>
        <h1>Auth dev page</h1>
        <hr />
        ${this.renderQuickLoginSection()} ${this.renderCreateUserSection()}
      </container-view>
    `;
  }

  private renderQuickLoginSection() {
    return html`
      <p>
        <h2>Quick login</h2>
        <input-view
          required
          label="Quick login"
          value=${this.loginUserID}
          @onChange=${(e: CustomEvent<string>) => (this.loginUserID = e.detail)}
        ></input-view>
        <qing-button @click=${this.handleSignIn}>Sign in</qing-button>
        <qing-button @click=${this.handleSignOut}>Sign out</qing-button>
      </p>
    `;
  }

  private renderCreateUserSection() {
    return html` <h2>Create a user</h2>
      <hr />
      <input-view
        required
        label="ID (Optional)"
        value=${this.newUserID}
        @onChange=${(e: CustomEvent<string>) => (this.newUserID = e.detail)}
      ></input-view>
      <input
        type="checkbox"
        @change=${(e: Event) => (this.newUserAdmin = (e.target as HTMLInputElement).checked)}
      />
      <qing-button>Create</qing-button>`;
  }

  private handleSignIn() {
    if (!this.loginUserID) {
      return;
    }
    window.location.href = `/${routes.auth.in}/${this.loginUserID}`;
  }

  private handleSignOut() {
    window.location.href = routes.auth.out;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'auth-dev': AuthDev;
  }
}
