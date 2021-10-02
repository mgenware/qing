/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import 'ui/form/inputView';
import 'qing-button';
import routes from '../devRoutes';

@ll.customElement('auth-dev-page')
export class AuthDevPage extends ll.BaseElement {
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

  @ll.string loginUserID = '10';
  @ll.string newUserID = '';
  @ll.bool newUserAdmin = false;

  render() {
    return ll.html`
      <container-view>
        <h1>Auth dev page</h1>
        <hr />
        ${this.renderQuickLoginSection()}
      </container-view>
    `;
  }

  private renderQuickLoginSection() {
    return ll.html`
      <div>
        <h2>Quick login</h2>
        <input-view
          required
          label="Quick login"
          value=${this.loginUserID}
          @onChange=${(e: CustomEvent<string>) => (this.loginUserID = e.detail)}>
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
