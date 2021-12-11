/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css } from 'll';
import ls from 'ls';
import routes from 'routes';
import { SettingsBaseItem, SettingsBaseView } from '../m/settings/settingsBaseView';

const items: SettingsBaseItem[] = [
  { name: ls.adminAccounts, link: routes.mx.admins },
  { name: ls.communitySettingsName, link: routes.mx.community },
];

@customElement('mx-settings-view')
export class MXSettingsView extends SettingsBaseView {
  static get styles() {
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
    this.settingsTitle = ls.siteSettings;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mx-settings-view': MXSettingsView;
  }
}
