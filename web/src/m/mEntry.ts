/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { html, TemplateResult } from 'll';
import ls from 'ls';
import * as mRoute from '@qing/routes/m';
import './settings/mSettingsView';
import './settings/profile/editProfileApp';
import './postCenter/myPostsApp';
import './postCenter/myDiscussionsApp';
import './postCenter/myQuestionsApp';
import { MiniURLRouter } from 'lib/miniURLRouter';
import pageUtils from 'app/utils/pageUtils';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  pageUtils.setTitleAndMainContent(
    [selectedItem, ls.settings],
    html`<m-settings-view .selectedItem=${selectedItem}>${content}</m-settings-view>`,
  );
}

router.register(mRoute.settingsProfile, () => {
  loadSettingsContent(ls.profile, html` <edit-profile-app></edit-profile-app> `);
});
router.register(mRoute.yourPosts, () => {
  pageUtils.setTitleAndMainContent([ls.yourPosts], html`<my-posts-app></my-posts-app>`);
});
router.register(mRoute.yourDiscussions, () => {
  pageUtils.setTitleAndMainContent(
    [ls.yourDiscussions],
    html`<my-discussions-app></my-discussions-app>`,
  );
});
router.register(mRoute.yourQuestions, () => {
  pageUtils.setTitleAndMainContent([ls.yourQuestions], html`<my-questions-app></my-questions-app>`);
});

router.startOnce();
