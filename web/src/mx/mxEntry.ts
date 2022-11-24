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
import './admins/siteAdminST';
import './general/siteGeneralST';
import './siteSTView';
import { MiniURLRouter } from 'lib/miniURLRouter';
import * as pu from 'lib/pageUtil';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  pu.setTitleAndMainContent(
    [selectedItem, ls.siteSettings],
    html`<site-st-view .selectedItem=${selectedItem}>${content}</site-st-view>`,
  );
}

router.register(mxRoute.admins, () => {
  loadSettingsContent(ls.adminAccounts, html`<site-admin-st></site-admin-st>`);
});

router.register(mxRoute.general, () => {
  loadSettingsContent(ls.generalSettings, html`<site-general-st></site-general-st>`);
});

router.startOnce();
