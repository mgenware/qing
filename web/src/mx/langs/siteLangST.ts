/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, when, state } from 'll';
import 'ui/forms/checkBox';
import 'ui/status/statusView';
import 'ui/content/headingView';
import 'ui/content/subheadingView';
import 'ui/forms/cardSelector';
import 'ui/status/statefulPage';
import '../cm/needRestartView';
import '../cm/siteTypeSelector';
import { StatefulPage } from 'ui/status/statefulPage';
import appTask from 'app/appTask';
import { GetLangSiteSTLoader } from '../loaders/getSiteSTLoader';
import { SetSiteLangsSTLoader } from 'mx/loaders/setSiteSTLoader';
import { NameAndID } from 'sod/api';

@customElement('site-lang-st')
export class SiteLangST extends StatefulPage {
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

  @state() _needRestart = false;
  @state() _supportedLangs: NameAndID[] = [];
  @state() _langs: string[] = [];

  override renderContent() {
    return html`
      <heading-view>${globalThis.mxLS.languages}</heading-view>
      ${when(this._needRestart, () => html`<need-restart-view></need-restart-view>`)}
      <div>
        <subheading-view>${globalThis.mxLS.supportedLangs}</subheading-view>
        ${this._supportedLangs.map((lang) => html`<div>${lang.name}</div>`)}
        <div class="m-t-md">
          <qing-button btnStyle="success" @click=${this.handleSaveClick}>
            ${globalThis.coreLS.save}
          </qing-button>
        </div>
      </div>
    `;
  }

  override async reloadStatefulPageDataAsync() {
    const loader = new GetLangSiteSTLoader();
    const status = await appTask.local(loader, (s) => (this.loadingStatus = s));
    const d = status.data;
    if (d) {
      this._needRestart = !!d.needRestart;
      this._supportedLangs = d.supported;
    }
  }

  private async handleSaveClick() {
    const loader = new SetSiteLangsSTLoader(this._langs);
    const status = await appTask.critical(loader, globalThis.coreLS.saving);
    if (status.isSuccess) {
      this._needRestart = true;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'site-lang-st': SiteLangST;
  }
}
