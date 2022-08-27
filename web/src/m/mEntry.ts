/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { html, TemplateResult } from 'll';
import ls from 'ls';
import * as mRoute from '@qing/routes/d/m';
import './settings/mSettings';
import './settings/profile/profileSettings';
import './postCenter/myPostsApp';
import './postCenter/myThreadsApp';
import { MiniURLRouter } from 'lib/miniURLRouter';
import * as pu from 'app/utils/pageUtils';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  pu.setTitleAndMainContent(
    [selectedItem, ls.settings],
    html`<m-settings .selectedItem=${selectedItem}>${content}</m-settings>`,
  );
}

router.register(mRoute.settingsProfile, () => {
  loadSettingsContent(ls.profile, html` <profile-settings></profile-settings> `);
});
router.register(mRoute.yourPosts, () => {
  pu.setTitleAndMainContent([ls.yourPosts], html`<my-posts-app></my-posts-app>`);
});
router.register(mRoute.yourThreads, () => {
  pu.setTitleAndMainContent([ls.yourThreads], html`<my-threads-app></my-threads-app>`);
});

router.startOnce();
