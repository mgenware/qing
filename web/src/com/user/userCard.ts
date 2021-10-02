/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import UserInfo from './userInfo';

@ll.customElement('user-card')
export class UserCard extends ll.BaseElement {
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

  @ll.object user: UserInfo | null = null;

  render() {
    const { user } = this;
    if (!user) {
      return '';
    }
    return ll.html`
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
