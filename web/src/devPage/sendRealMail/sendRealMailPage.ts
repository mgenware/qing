/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import 'ui/forms/inputView';
import 'ui/forms/checklistView';
import 'qing-button';
import * as loaders from './loaders.js';
import appTask from 'app/appTask.js';

@customElement('send-real-mail-page')
export class SendRealMailPage extends BaseElement {
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

  @property() to = '';
  @property() subject = '';
  @property() contentHTML = '';

  override render() {
    return html`
      <div>
        <h1>Send real mails</h1>
        <hr />
        <input-view
          class="m-t-md"
          required
          label="To"
          value=${this.to}
          @input-change=${(e: CustomEvent<string>) => (this.to = e.detail)}>
        </input-view>
        <input-view
          class="m-t-md"
          required
          label="Subject"
          value=${this.subject}
          @input-change=${(e: CustomEvent<string>) => (this.subject = e.detail)}>
        </input-view>
        <input-view
          class="m-t-md"
          required
          label="Content"
          value=${this.contentHTML}
          @input-change=${(e: CustomEvent<string>) => (this.contentHTML = e.detail)}>
        </input-view>
        <qing-button class="m-t-lg" @click=${this.handleSendClick}>Send</qing-button>
      </div>
    `;
  }

  private async handleSendClick() {
    const loader = new loaders.SendRealMailLoader({
      to: this.to,
      title: this.subject,
      content: this.contentHTML,
      forceProd: 1,
    });
    await appTask.critical(loader);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'send-real-mail-page': SendRealMailPage;
  }
}
