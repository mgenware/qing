/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, when, state } from 'll.js';
import 'ui/status/statusView.js';
import 'ui/content/headingView.js';
import 'ui/content/subheadingView.js';
import 'ui/forms/cardSelector.js';
import 'ui/status/statefulPage.js';
import '../cm/needRestartView.js';
import { StatefulPage } from 'ui/status/statefulPage.js';
import appTask from 'app/appTask.js';
import { frozenDef } from '@qing/def';
import { GetGenSiteSTLoader } from '../loaders/getSiteSTLoader.js';
import { SetSiteInfoSTLoader, SetPostPermSTLoader } from 'admin/loaders/setSiteSTLoader.js';
import { CHECK } from 'checks.js';
import { CheckListChangeArgs, CheckListItem } from 'ui/forms/checkList.js';

const infoBlockCls = 'info-block';
const siteTypeBlockCls = 'site-type-block';

const postPermChecklist: CheckListItem[] = [
  { key: frozenDef.PostPermissionConfig.onlyMe, text: globalThis.adminLS.roleOnlyMe },
  { key: frozenDef.PostPermissionConfig.everyone, text: globalThis.adminLS.roleEveryone },
];

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
  @state() _postPerm = frozenDef.PostPermissionConfig.onlyMe;
  @state() _siteName = '';
  @state() _siteURL = '';

  override renderContent() {
    return html`
      <heading-view>${globalThis.coreLS.generalSettings}</heading-view>
      ${when(this._needRestart, () => html`<need-restart-view></need-restart-view>`)}
      <div class=${infoBlockCls}>
        <subheading-view>${globalThis.adminLS.siteInfo}</subheading-view>

        <input-view
          required
          label=${globalThis.adminLS.siteName}
          value=${this._siteName}
          @input-change=${(e: CustomEvent<string>) => (this._siteName = e.detail)}></input-view>

        <input-view
          required
          label=${globalThis.adminLS.siteURL}
          value=${this._siteURL}
          @input-change=${(e: CustomEvent<string>) => (this._siteURL = e.detail)}></input-view>

        <qing-button btnStyle="success" @click=${this.handleSaveSiteInfoClick}>
          ${globalThis.adminLS.save}
        </qing-button>
      </div>

      <div class=${`${siteTypeBlockCls} m-t-lg`}>
        <subheading-view>${globalThis.adminLS.whoCanWritePosts}</subheading-view>
        <check-list
          .items=${postPermChecklist}
          .selectedItems=${[this._postPerm]}
          @checklist-change=${(e: CustomEvent<CheckListChangeArgs>) =>
            (this._postPerm = e.detail.selectedItem())}></check-list>
        <div class="m-t-md">
          <qing-button btnStyle="success" @click=${this.handleSaveSiteTypeClick}>
            ${globalThis.adminLS.save}
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
      this._postPerm = d.postPerm as frozenDef.PostPermissionConfig;
    }
  }

  private async handleSaveSiteTypeClick() {
    CHECK(this._postPerm);
    const loader = new SetPostPermSTLoader(this._postPerm);
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
