/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { html, TemplateResult } from 'll';
import ls from 'ls';
import routes from 'routes';
import './admins/adminsSettingsPage';
import './forums/forumsSettingsPage';
import './mxSettingsView';
import { MiniURLRouter } from 'lib/miniURLRouter';
import pageUtils from 'app/utils/pageUtils';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  pageUtils.setTitleAndMainContent(
    [selectedItem, ls.siteSettings],
    html`<mx-settings-view .selectedItem=${selectedItem}>${content}</mx-settings-view>`,
  );
}

router.register(routes.mx.admins, () => {
  loadSettingsContent(ls.adminAccounts, html`<admins-settings-page></admins-settings-page>`);
});

router.register(routes.mx.forums, () => {
  loadSettingsContent(ls.forums, html`<forums-settings-page></forums-settings-page>`);
});

router.startOnce();
