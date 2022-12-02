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
import { SetGenSiteSTLoader } from './loaders/setSiteSTLoader';
import { siteTypeOptions } from '../cm/siteTypeSelector';
import { GetGenSiteSTLoader } from './loaders/getSiteSTLoader';

@customElement('site-general-st')
export class SiteGeneralST extends StatefulPage {
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
  @state() _selectedSiteType: appdef.SiteType | undefined;

  override renderContent() {
    return html`
      <heading-view>${globalThis.coreLS.generalSettings}</heading-view>
      ${when(this._needRestart, () => html`<need-restart-view></need-restart-view>`)}
      <subheading-view>${globalThis.coreLS.siteType}</subheading-view>
      <card-selector
        .items=${siteTypeOptions}
        .selectedValue=${this._selectedSiteType}
        @card-select=${this.handleSiteTypeChanged}></card-selector>
      <site-type-selector .siteType=${this._selectedSiteType}></site-type-selector>
      <div>
        <qing-button btnStyle="success" @click=${this.handleSaveClick}>
          ${globalThis.coreLS.save}
        </qing-button>
      </div>
    `;
  }

  override async reloadStatefulPageDataAsync() {
    const loader = new GetGenSiteSTLoader();
    const status = await appTask.local(loader, (s) => (this.loadingStatus = s));
    const d = status.data;
    if (d) {
      this._needRestart = !!d.needRestart;
      this._selectedSiteType = d.siteType as appdef.SiteType;
    }
  }

  private handleSiteTypeChanged(e: CustomEvent<CardSelectedDetail>) {
    this._selectedSiteType = e.detail.item.value;
  }

  private async handleSaveClick() {
    const loader = new SetGenSiteSTLoader({
      siteType: this._selectedSiteType,
    });
    const status = await appTask.critical(loader, globalThis.coreLS.saving);
    if (status.isSuccess) {
      this._needRestart = true;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'site-general-st': SiteGeneralST;
  }
}
