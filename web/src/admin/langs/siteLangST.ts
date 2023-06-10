/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, when, state } from 'll.js';
import 'ui/forms/checkBox';
import 'ui/status/statusView';
import 'ui/content/headingView.js';
import 'ui/content/subheadingView.js';
import 'ui/forms/checkmarkView.js';
import 'ui/status/statefulPage.js';
import '../cm/needRestartView';
import { StatefulPage } from 'ui/status/statefulPage.js';
import appTask from 'app/appTask.js';
import { GetLangSiteSTLoader } from '../loaders/getSiteSTLoader.js';
import { SetSiteLangsSTLoader } from 'admin/loaders/setSiteSTLoader.js';
import { NameAndID } from 'sod/api.js';
import * as cu from 'lib/collectionUtil.js';

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
  @state() _selectedLangs = new Set<string>();

  override renderContent() {
    return html`
      <heading-view>${globalThis.mxLS.languages}</heading-view>
      ${when(this._needRestart, () => html`<need-restart-view></need-restart-view>`)}
      <div>
        <subheading-view>${globalThis.mxLS.supportedLangs}</subheading-view>
        <checkmark-list>
          ${this._supportedLangs.map(
            (lang) => html`<checkmark-view
              .checked=${this._selectedLangs.has(lang.id)}
              @click=${() =>
                (this._selectedLangs = cu.toggleSetMember(this._selectedLangs, lang.id, true))}
              >${lang.name}</checkmark-view
            >`,
          )}
        </checkmark-list>
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
      this._selectedLangs = new Set(d.current);
    }
  }

  private async handleSaveClick() {
    const loader = new SetSiteLangsSTLoader([...this._selectedLangs]);
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
