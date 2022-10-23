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
import './settings/lang/langSettings';
import './postCenter/myPostsApp';
import './postCenter/myFPostsApp';
import { MiniURLRouter } from 'lib/miniURLRouter';
import * as pu from 'lib/pageUtil';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  pu.setTitleAndMainContent(
    [selectedItem, ls.settings],
    html`<m-settings .selectedItem=${selectedItem}>${content}</m-settings>`,
  );
}

router.register(mRoute.profileSettings, () => {
  loadSettingsContent(ls.profile, html`<profile-settings></profile-settings>`);
});
router.register(mRoute.langSettings, () => {
  loadSettingsContent(ls.language, html`<lang-settings></lang-settings>`);
});
router.register(mRoute.yourPosts, () => {
  pu.setTitleAndMainContent([ls.yourPosts], html`<my-posts-app></my-posts-app>`);
});
router.register(mRoute.yourFPosts, () => {
  pu.setTitleAndMainContent([ls.yourFPosts], html`<my-fposts-app></my-fposts-app>`);
});

router.startOnce();
