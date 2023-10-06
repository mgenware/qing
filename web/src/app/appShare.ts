/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html } from 'll.js';
import { renderTemplateResult } from 'lib/htmlLib.js';
import 'com/share/sharePopup.js';

const shareContainerID = '__g_share_container';

export interface SharePopupOptions {
  noAutoDomain?: boolean;
}

export class AppShare {
  showSharePopup(link: string, opt?: SharePopupOptions) {
    const template = html`<share-popup
      open
      .link=${link}
      ?noAutoDomain=${opt?.noAutoDomain}></share-popup>`;
    const el = renderTemplateResult(shareContainerID, template);
    // Fix "OK" button not focusing.
    setTimeout(() => el?.focus(), 0);
  }
}

const appShare = new AppShare();
export default appShare;
