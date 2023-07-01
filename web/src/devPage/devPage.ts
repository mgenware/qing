/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, state } from 'll.js';
import * as authRoute from '@qing/routes/dev/auth.js';
import * as devRoot from '@qing/routes/dev/root.js';
import * as mailsRoute from '@qing/routes/dev/mails.js';
import * as miscAPI from '@qing/routes/dev/api/misc.js';
import LoadingStatus from 'lib/loadingStatus.js';
import 'ui/status/statusView.js';
import Loader from 'lib/loader.js';

class GetRealIPLoader extends Loader<string> {
  override requestURL(): string {
    return miscAPI.realIP;
  }
}

@customElement('dev-page')
export class DevPage extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        div.root-list a {
          display: block;
          padding: 0.5rem 0;
        }
      `,
    ];
  }

  @state() _realIPLoadingStatus = LoadingStatus.notStarted;
  @state() _realIP = '';

  override async firstUpdated() {
    await this.loadReadIP();
  }

  override render() {
    return html`
      <h1>qing.dev</h1>
      <hr />
      <div class="root-list">
        <a href=${authRoute.authRoot}>Auth</a>
        <a href=${devRoot.elements}>Elements</a>
        <a href=${mailsRoute.users}>User mails</a>
        <a href=${devRoot.sendRealMail}>Send real mails</a>
      </div>
      ${this.renderRealIP()}
    `;
  }

  private async renderRealIP() {
    return html`
      <h2>Real-IP:</h2>
      <p>
        <code
          >${this._realIPLoadingStatus.isSuccess
            ? html`${this._realIP}`
            : html`<status-view .status=${this._realIPLoadingStatus}></status-view>`}</code
        >
      </p>
    `;
  }

  private async loadReadIP() {
    const loader = new GetRealIPLoader();
    loader.loadingStatusChanged = (status) => {
      this._realIPLoadingStatus = status;
    };
    const ip = await loader.startAsync();
    if (ip) {
      this._realIP = ip;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dev-page': DevPage;
  }
}
