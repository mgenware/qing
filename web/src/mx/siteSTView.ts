/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css } from 'll';
import * as mxRoute from '@qing/routes/d/mx';
import { SettingsBaseItem, SettingsBaseView } from '../m/settings/settingsBaseView';

const items: SettingsBaseItem[] = [
  { name: globalThis.coreLS.generalSettings, link: mxRoute.general },
  { name: globalThis.mxLS.languages, link: mxRoute.languages },
  { name: globalThis.mxLS.adminAccounts, link: mxRoute.admins },
];

@customElement('site-st-view')
export class SiteSTView extends SettingsBaseView {
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

  constructor() {
    super();

    this.items = items;
    this.settingsTitle = globalThis.coreLS.siteSettings;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'site-st-view': SiteSTView;
  }
}
