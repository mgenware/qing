/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import UserInfo from './userInfo';

@customElement('user-card')
export class UserCard extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @lp.object user: UserInfo | null = null;

  override render() {
    const { user } = this;
    if (!user) {
      return '';
    }
    return html`
      <img src=${user.iconURL} class="avatar-m vertical-align-middle" width="40" height="40" />
      <span class="m-l-xs">${user.name}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-card': UserCard;
  }
}
