import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/form/inputView';
import 'qing-button';
import routes from '../devRoutes';

@customElement('auth-dev-page')
export class AuthDevPage extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @lp.string loginUserID = '10';
  @lp.string newUserID = '';
  @lp.bool newUserAdmin = false;

  render() {
    return html`
      <container-view>
        <h1>Auth dev page</h1>
        <hr />
        ${this.renderQuickLoginSection()}
      </container-view>
    `;
  }

  private renderQuickLoginSection() {
    return html`
      <div>
        <h2>Quick login</h2>
        <input-view
          required
          label="Quick login"
          value=${this.loginUserID}
          @onChange=${(e: CustomEvent<string>) => (this.loginUserID = e.detail)}
        >
        </input-view>
        <p>
          <qing-button @click=${this.handleSignIn}>Sign in</qing-button>
          <qing-button @click=${this.handleSignOut}>Sign out</qing-button>
        </p>
      </div>
    `;
  }

  private handleSignIn() {
    if (!this.loginUserID) {
      return;
    }
    window.location.href = `${routes.auth.in}/${this.loginUserID}`;
  }

  private handleSignOut() {
    window.location.href = routes.auth.out;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'auth-dev-page': AuthDevPage;
  }
}
