/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, when, property, state } from 'll';
import ls from 'ls';
import LoadingStatus from 'lib/loadingStatus';
import 'ui/forms/checkBox';
import 'ui/status/statusView';
import 'ui/content/headingView';
import 'ui/status/statefulPage';
import '../cm/needRestartView';
import '../cm/siteTypeSelector';
import { StatefulPage } from 'ui/status/statefulPage';
import { GetGenSiteSTLoader } from './loaders/getSiteSettingsLoader';
import UpdateSiteSettingsLoader from './loaders/updateSiteSettingsLoader';
import appTask from 'app/appTask';
import { appdef } from '@qing/def';
import { SiteGenSettings } from 'sod/mx';
import { SetGenSiteSTLoader } from './loaders/setSiteSTLoader';

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
  @state() _selectedSiteType: appdef.SiteType = 0;

  override renderContent() {
    return html`
      <status-overlay .status=${this.savingStatus}>
        <heading-view>${ls.generalSettings}</heading-view>
        ${when(this._needRestart, () => html`<need-restart-view></need-restart-view>`)}
        <h2>${ls.siteType}</h2>
        <site-type-selector .siteType=${this._selectedSiteType}></site-type-selector>
        <p>
          <checklist-view
            @checklist-change=${(e: CustomEvent<number[]>) =>
              (this._selectedSiteType = e.detail + 1)}
            class="m-t-md"
            .selectedIndices=${this.checklistIndices2}
            .dataSource=${checklistViewData}></checklist-view>
        </p>
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
