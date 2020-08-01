import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/form/inputView';
import './ui/viewsDemo';

@customElement('t-page')
export class TPage extends BaseElement {
  @lp.string loginUserID = '1';

  render() {
    return html`
      <container-view>
        <h1>Qing Debug Page</h1>
        <hr />
        <h2>Auth</h2>
        ${this.renderSignInHelper()}
        <h2>UI</h2>
        <p><a href="/t/views">Views</a></p>
      </container-view>
    `;
  }

  private renderSignInHelper() {
    return html`
      <p>
        <input-view
          required
          label="Quick login"
          value=${this.loginUserID}
          @onChange=${(e: CustomEvent<string>) => (this.loginUserID = e.detail)}
        ></input-view>
        <qing-button @click=${this.handleLogin}>Log in</qing-button>
      </p>
    `;
  }

  private handleLogin() {
    if (!this.loginUserID) {
      return;
    }
    window.location.href = `/t/auth/in/${this.loginUserID}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    't-page': TPage;
  }
}
