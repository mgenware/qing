/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property, state } from 'll.js';
import 'ui/alerts/noContentView.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import * as loaders from './loaders.js';
import appTask from 'app/appTask.js';
import './mbDate';
import { DevMail } from 'sod/dev/dev.js';

@customElement('mb-mail-page')
export class MBMailPage extends BaseElement {
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

  @property() email = '';
  @property() dirName = '';
  @state() mail?: DevMail;
  @state() date?: Date;

  override render() {
    const { mail } = this;
    if (!mail) {
      return html``;
    }
    return html`
      <h1>${mail.title}</h1>
      <mb-date .ts=${mail.tsMilli}></mb-date>
      <div>${unsafeHTML(mail.content)}</div>
    `;
  }

  override async firstUpdated() {
    if (!this.email) {
      throw new Error('`email` cannot be empty');
    }
    if (!this.dirName) {
      throw new Error('`dirName` cannot be empty');
    }
    const loader = new loaders.MailLoader(this.email, this.dirName);
    const res = await appTask.critical(loader);
    if (res.data) {
      this.mail = res.data;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-mail-page': MBMailPage;
  }
}
