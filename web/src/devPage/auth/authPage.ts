/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import 'ui/form/inputView';
import 'qing-button';
import routes from '../devRoutes';

@customElement('auth-page')
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
      <div>
        <h1>Auth dev page</h1>
        <hr />
        ${this.renderQuickLoginSection()}
      </div>
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
    window.location.href = `${routes.authGetApi.in}/${this.loginUserID}`;
  }

  private handleSignOut() {
    window.location.href = routes.authGetApi.out;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'auth-page': AuthDevPage;
  }
}
