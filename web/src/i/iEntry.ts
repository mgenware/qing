/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core.js';
import { html, TemplateResult } from 'll.js';
import * as mRoute from '@qing/routes/i.js';
import './settings/iSettings';
import './settings/profile/profileST';
import './settings/lang/langST';
import './postCenter/myPostsApp';
import './postCenter/myFPostsApp';
import * as pu from 'lib/pageUtil.js';
import QingURLRouter from 'lib/qingURLRouter.js';

const router = new QingURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  pu.setTitleAndMainContent(
    [selectedItem, globalThis.coreLS.settings],
    html`<i-settings .selectedItem=${selectedItem}>${content}</i-settings>`,
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
