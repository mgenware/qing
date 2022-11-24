/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, when, state } from 'll';
import ls from 'ls';
import LoadingStatus from 'lib/loadingStatus';
import 'ui/forms/checkBox';
import 'ui/status/statusView';
import 'ui/content/headingView';
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

@customElement('gen-sst')
export class GenSST extends StatefulPage {
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

  @state() savingStatus = LoadingStatus.success;

  @state() _needRestart = false;
  @state() _selectedSiteType: appdef.SiteType | undefined;

  override renderContent() {
    return html`
      <status-overlay .status=${this.savingStatus}>
        <heading-view>${ls.generalSettings}</heading-view>
        ${when(this._needRestart, () => html`<need-restart-view></need-restart-view>`)}
        <h2>${ls.siteType}</h2>
        <card-selector
          .items=${siteTypeOptions}
          .selectedValue=${this._selectedSiteType}
          @card-select=${this.handleSiteTypeChanged}></card-selector>
        <site-type-selector .siteType=${this._selectedSiteType}></site-type-selector>
        <qing-button btnStyle="success" @click=${this.handleSaveClick}> ${ls.save} </qing-button>
      </status-overlay>
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
    const status = await appTask.critical(loader, ls.saving, (s) => (this.savingStatus = s));
    if (status.isSuccess) {
      this._needRestart = true;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gen-sst': GenSST;
  }
}
