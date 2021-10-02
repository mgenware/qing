/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import * as ll from 'll';
import ls from 'ls';
import routes from 'routes';
import './userMgr/userMgrApp';
import './mxSettingsView';
import { MiniURLRouter } from 'lib/miniURLRouter';
import pageUtils from 'app/utils/pageUtils';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: ll.TemplateResult) {
  pageUtils.setTitleAndMainContent(
    [selectedItem, ls.adminSettings],
    ll.html`<mx-settings-view .selectedItem=${selectedItem}>${content}</mx-settings-view>`,
  );
}

router.register(routes.mx.usersAndGroups, () => {
  loadSettingsContent(ls.usersAndGroups, ll.html` <user-mgr-app></user-mgr-app> `);
});

router.startOnce();
