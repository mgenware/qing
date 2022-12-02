/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css } from 'll';
import * as mRoute from '@qing/routes/d/m';
import { SettingsBaseItem, SettingsBaseView } from './settingsBaseView';

const items: SettingsBaseItem[] = [
  { name: globalThis.coreLS.profile, link: mRoute.profileSettings },
  { name: globalThis.coreLS.language, link: mRoute.langSettings },
];

@customElement('m-settings')
export class MSettings extends SettingsBaseView {
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
    this.settingsTitle = globalThis.coreLS.settings;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm-settings': MSettings;
  }
}
