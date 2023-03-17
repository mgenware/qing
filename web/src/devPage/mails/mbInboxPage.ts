/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property, state, TemplateResult } from 'll';
import 'ui/alerts/noContentView';
import * as mailsRoute from '@qing/routes/dev/mails';
import * as loaders from './loaders';
import appTask from 'app/appTask';
import './mbDate';
import { DevMail } from 'sod/dev/dev';

@customElement('mb-inbox-page')
export class MBInboxPage extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root a {
          display: block;
          margin-bottom: 1rem;
        }
      `,
    ];
  }

  @property() email = '';
  @state() mails: DevMail[] = [];

  override render() {
    const { mails, email } = this;
    let content: TemplateResult;
    if (!mails.length) {
      content = html`<no-content-view></no-content-view>`;
    } else {
      content = html`
        <div class="root m-b-md">
          ${mails.map(
            (m) => html`<a
              href=${`${mailsRoute.mail}/${encodeURIComponent(email)}/${encodeURIComponent(m.id)}`}>
              <h3>${m.title}</h3>
              <mb-date .ts=${m.tsMilli}></mb-date>
              <hr />
            </a>`,
          )}
        </div>
      `;
    }
    return html` <h1>${email}</h1>
      ${content}`;
  }

  override async firstUpdated() {
    if (!this.email) {
      throw new Error('`email` cannot be empty');
    }
    const loader = new loaders.InboxLoader(this.email);
    const res = await appTask.critical(loader);
    if (res.data) {
      this.mails = res.data;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-inbox-page': MBInboxPage;
  }
}
