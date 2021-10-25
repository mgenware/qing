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

        p qing-button {
          margin-right: 1rem;
        }
      `,
    ];
  }

  @lp.string uidStr = '10';
  @lp.bool newUserAdmin = false;

  render() {
    return html`
      <div>
        <h1>Auth dev page</h1>
        <hr />
        <blockquote>
          UID should be a <code>uint64</code>, use <code>-&lt;EID&gt;</code> for encoded IDs.
        </blockquote>
        ${this.renderUserSection()}
      </div>
    `;
  }

  private renderUserSection() {
    return html`
      <div>
        <input-view
          required
          label="UID"
          value=${this.uidStr}
          @onChange=${(e: CustomEvent<string>) => (this.uidStr = e.detail)}>
        </input-view>
        <p>
          <qing-button @click=${this.handleSignIn}>Sign in</qing-button>
          <qing-button @click=${this.handleSignOut}>Sign out</qing-button>
        </p>
        <p>
          <qing-button @click=${this.handleNewUser}>New user</qing-button
          ><qing-button @click=${this.handleGetInfo}>Get info</qing-button>
        </p>
      </div>
    `;
  }

  private handleSignIn() {
    if (!this.uidStr) {
      return;
    }
    this.navigateToURL(`${routes.auth_get_api.in}/${this.uidStr}`);
  }

  private handleSignOut() {
    this.navigateToURL(routes.auth_get_api.out);
  }

  private handleNewUser() {
    this.navigateToURL(routes.auth_get_api.new);
  }

  private handleGetInfo() {
    this.navigateToURL(`${routes.auth_get_api.info}/${this.uidStr}`);
  }

  private navigateToURL(s: string) {
    window.location.href = s;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'auth-page': AuthDevPage;
  }
}
