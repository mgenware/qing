/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, when, state } from 'll.js';
import 'ui/forms/checkBox.js';
import 'ui/status/statusView.js';
import 'ui/content/headingView.js';
import 'ui/content/subheadingView.js';
import 'ui/forms/cardSelector.js';
import 'ui/status/statefulPage.js';
import '../cm/needRestartView.js';
import { CardSelectedDetail } from 'ui/forms/cardSelector.js';
import { StatefulPage } from 'ui/status/statefulPage.js';
import appTask from 'app/appTask.js';
import { appdef } from '@qing/def';
import { GetGenSiteSTLoader } from '../loaders/getSiteSTLoader.js';
import { SetSiteInfoSTLoader, SetSiteTypeSTLoader } from 'mx/loaders/setSiteSTLoader.js';
import { CHECK } from 'checks.js';

const infoBlockCls = 'info-block';
const siteTypeBlockCls = 'site-type-block';

@customElement('site-general-st')
export class SiteGeneralST extends StatefulPage {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        input-view {
          margin-bottom: 1rem;
        }
      `,
    ];
  }

  @state() _needRestart = false;
  @state() _postPerm = appdef.PostPermission.onleMe;
  @state() _siteName = '';
  @state() _siteURL = '';

  override renderContent() {
    return html`
      <heading-view>${globalThis.coreLS.generalSettings}</heading-view>
      ${when(this._needRestart, () => html`<need-restart-view></need-restart-view>`)}
      <div class=${infoBlockCls}>
        <subheading-view>${globalThis.mxLS.siteInfo}</subheading-view>

        <input-view
          required
          label=${globalThis.mxLS.siteName}
          value=${this._siteName}
          @input-change=${(e: CustomEvent<string>) => (this._siteName = e.detail)}></input-view>

        <input-view
          required
          label=${globalThis.mxLS.siteURL}
          value=${this._siteURL}
          @input-change=${(e: CustomEvent<string>) => (this._siteURL = e.detail)}></input-view>

        <qing-button btnStyle="success" @click=${this.handleSaveSiteInfoClick}>
          ${globalThis.mxLS}
        </qing-button>
      </div>

      <div class=${`${siteTypeBlockCls} m-t-lg`}>
        <subheading-view>${globalThis.mxLS.whoCanWritePosts}</subheading-view>
        <div>
          <qing-button btnStyle="success" @click=${this.handleSaveSiteTypeClick}>
            ${globalThis.mxLS.save}
          </qing-button>
        </div>
      </div>
    `;
  }

  override async reloadStatefulPageDataAsync() {
    const loader = new GetGenSiteSTLoader();
    const status = await appTask.local(loader, (s) => (this.loadingStatus = s));
    const d = status.data;
    if (d) {
      this._needRestart = !!d.needRestart;
      this._siteName = d.siteName || '';
      this._siteURL = d.siteURL || '';
      this._selectedSiteType = d.siteType as appdef.SiteType;
    }
  }

  private handleSiteTypeChanged(e: CustomEvent<CardSelectedDetail>) {
    this._selectedSiteType = e.detail.item.value;
  }

  private async handleSaveSiteTypeClick() {
    CHECK(this._selectedSiteType);
    const loader = new SetSiteTypeSTLoader(this._selectedSiteType);
    const status = await appTask.critical(loader, globalThis.coreLS.saving);
    if (status.isSuccess) {
      this._needRestart = true;
    }
  }

  private async handleSaveSiteInfoClick() {
    if (!this.validateInfoForm()) {
      return;
    }
    CHECK(this._postPerm);
    const loader = new SetSiteInfoSTLoader({ siteName: this._siteName, siteURL: this._siteURL });
    const status = await appTask.critical(loader, globalThis.coreLS.saving);
    if (status.isSuccess) {
      this._needRestart = true;
    }
  }

  private validateInfoForm() {
    if (!this.checkFormValidity(`.${infoBlockCls} input-view`)) {
      return false;
    }
    return true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'site-general-st': SiteGeneralST;
  }
}
