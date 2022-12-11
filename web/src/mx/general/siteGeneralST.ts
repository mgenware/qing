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
import { CardSelectedDetail } from 'ui/forms/cardSelector';
import { StatefulPage } from 'ui/status/statefulPage';
import appTask from 'app/appTask';
import { appdef } from '@qing/def';
import { siteTypeOptions } from '../cm/siteTypeSelector';
import { GetGenSiteSTLoader } from '../loaders/getSiteSTLoader';
import { SetSiteInfoSTLoader, SetSiteTypeSTLoader } from 'mx/loaders/setSiteSTLoader';
import { CHECK } from 'checks';

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

  @state() needRestart = false;
  @state() selectedSiteType: appdef.SiteType | undefined;
  @state() siteName = '';
  @state() siteURL = '';

  override renderContent() {
    return html`
      <heading-view>${globalThis.coreLS.generalSettings}</heading-view>
      ${when(this.needRestart, () => html`<need-restart-view></need-restart-view>`)}
      <div class=${infoBlockCls}>
        <subheading-view>${globalThis.mxLS.siteInfo}</subheading-view>

        <input-view
          required
          label=${globalThis.mxLS.siteName}
          value=${this.siteName}
          @input-change=${(e: CustomEvent<string>) => (this.siteName = e.detail)}></input-view>

        <input-view
          required
          label=${globalThis.mxLS.siteURL}
          value=${this.siteURL}
          @input-change=${(e: CustomEvent<string>) => (this.siteURL = e.detail)}></input-view>

        <qing-button btnStyle="success" @click=${this.handleSaveSiteInfoClick}>
          ${globalThis.mxLS.saveSiteInfo}
        </qing-button>
      </div>

      <div class=${`${siteTypeBlockCls} m-t-lg`}>
        <subheading-view>${globalThis.mxLS.siteType}</subheading-view>
        <card-selector
          .items=${siteTypeOptions}
          .selectedValue=${this.selectedSiteType}
          @card-select=${this.handleSiteTypeChanged}></card-selector>
        <site-type-selector .siteType=${this.selectedSiteType}></site-type-selector>
        <div>
          <qing-button btnStyle="success" @click=${this.handleSaveSiteTypeClick}>
            ${globalThis.mxLS.saveSiteType}
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
      this.needRestart = !!d.needRestart;
      this.siteName = d.siteName || '';
      this.siteURL = d.siteURL || '';
      this.selectedSiteType = d.siteType as appdef.SiteType;
    }
  }

  private handleSiteTypeChanged(e: CustomEvent<CardSelectedDetail>) {
    this.selectedSiteType = e.detail.item.value;
  }

  private async handleSaveSiteTypeClick() {
    CHECK(this.selectedSiteType);
    const loader = new SetSiteTypeSTLoader(this.selectedSiteType);
    const status = await appTask.critical(loader, globalThis.coreLS.saving);
    if (status.isSuccess) {
      this.needRestart = true;
    }
  }

  private async handleSaveSiteInfoClick() {
    if (!this.validateInfoForm()) {
      return;
    }
    CHECK(this.selectedSiteType);
    const loader = new SetSiteInfoSTLoader({ siteName: this.siteName, siteURL: this.siteURL });
    const status = await appTask.critical(loader, globalThis.coreLS.saving);
    if (status.isSuccess) {
      this.needRestart = true;
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
