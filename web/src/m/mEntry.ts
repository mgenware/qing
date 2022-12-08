/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { html, TemplateResult } from 'll';
import * as mRoute from '@qing/routes/d/m';
import './settings/mSettings';
import './settings/profile/profileST';
import './settings/lang/langST';
import './postCenter/myPostsApp';
import './postCenter/myFPostsApp';
import { MiniURLRouter } from 'lib/miniURLRouter';
import * as pu from 'lib/pageUtil';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  pu.setTitleAndMainContent(
    [selectedItem, globalThis.coreLS.settings],
    html`<m-settings .selectedItem=${selectedItem}>${content}</m-settings>`,
  );
}

router.register(mRoute.profileSettings, () => {
  loadSettingsContent(globalThis.coreLS.profile, html`<profile-st></profile-st>`);
});
router.register(mRoute.langSettings, () => {
  loadSettingsContent(globalThis.coreLS.language, html`<lang-st></lang-st>`);
});
router.register(mRoute.yourPosts, () => {
  pu.setTitleAndMainContent([globalThis.coreLS.yourPosts], html`<my-posts-app></my-posts-app>`);
});
router.register(mRoute.yourFPosts, () => {
  pu.setTitleAndMainContent([globalThis.coreLS.yourFPosts], html`<my-fposts-app></my-fposts-app>`);
});

router.startOnce();
