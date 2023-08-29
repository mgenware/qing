/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core.js';
import { html, TemplateResult } from 'll.js';
import * as adminRoute from '@qing/routes/admin.js';
import './admins/siteAdminST';
import './general/siteGeneralST';
import './langs/siteLangST';
import './siteSTView';
import * as pu from 'lib/pageUtil.js';
import QingURLRouter from 'lib/qingURLRouter.js';

const router = new QingURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  pu.setTitleAndMainContent(
    [selectedItem, globalThis.coreLS.siteSettings],
    html`<site-st-view .selectedItem=${selectedItem}>${content}</site-st-view>`,
  );
}

router.register(adminRoute.admins, () => {
  loadSettingsContent(globalThis.adminLS.adminAccounts, html`<site-admin-st></site-admin-st>`);
});

router.register(adminRoute.general, () => {
  loadSettingsContent(globalThis.coreLS.generalSettings, html`<site-general-st></site-general-st>`);
});

router.register(adminRoute.languages, () => {
  loadSettingsContent(globalThis.adminLS.languages, html`<site-lang-st></site-lang-st>`);
});

router.startOnce();
