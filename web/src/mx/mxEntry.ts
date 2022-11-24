/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { html, TemplateResult } from 'll';
import ls from 'ls';
import * as mxRoute from '@qing/routes/d/mx';
import './admins/adminsSettingsPage';
import './mxSettingsView';
import { MiniURLRouter } from 'lib/miniURLRouter';
import * as pu from 'lib/pageUtil';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  pu.setTitleAndMainContent(
    [selectedItem, ls.siteSettings],
    html`<mx-settings-view .selectedItem=${selectedItem}>${content}</mx-settings-view>`,
  );
}

router.register(mxRoute.admins, () => {
  loadSettingsContent(ls.adminAccounts, html`<admins-settings-page></admins-settings-page>`);
});

router.startOnce();
