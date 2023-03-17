/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, state } from 'll.js';
import 'ui/alerts/noContentView.js';
import * as mailsRoute from '@qing/routes/dev/mails.js';
import * as loaders from './loaders.js';
import appTask from 'app/appTask.js';

@customElement('mb-users-page')
export class MBUsersPage extends BaseElement {
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

  @state() users: string[] = [];

  override render() {
    const { users } = this;
    if (!users.length) {
      return html`<no-content-view></no-content-view>`;
    }
    return html`
      <div class="root m-b-md">
        ${users.map((u) => html`<a href=${`${mailsRoute.inbox}/${u}`}><p>${u}</p> </a>`)}
      </div>
    `;
  }

  override async firstUpdated() {
    const loader = new loaders.UsersLoader();
    const res = await appTask.critical(loader);
    if (res.data) {
      this.users = res.data;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-users-page': MBUsersPage;
  }
}
