/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css } from 'll.js';
import * as adminRoute from '@qing/routes/admin.js';
import { SettingsBaseItem, SettingsBaseView } from '../i/settings/settingsBaseView.js';

const items: SettingsBaseItem[] = [
  { name: globalThis.coreLS.generalSettings, link: adminRoute.general },
  { name: globalThis.adminLS.languages, link: adminRoute.languages },
  { name: globalThis.adminLS.adminAccounts, link: adminRoute.admins },
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
