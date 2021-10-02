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
import './settings/mSettingsView';
import './settings/profile/editProfileApp';
import './postCenter/myPostsApp';
import './postCenter/myDiscussionsApp';
import './postCenter/myQuestionsApp';
import { MiniURLRouter } from 'lib/miniURLRouter';
import pageUtils from 'app/utils/pageUtils';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: ll.TemplateResult) {
  pageUtils.setTitleAndMainContent(
    [selectedItem, ls.settings],
    ll.html`<m-settings-view .selectedItem=${selectedItem}>${content}</m-settings-view>`,
  );
}

router.register(routes.m.settings.profile, () => {
  loadSettingsContent(ls.profile, ll.html` <edit-profile-app></edit-profile-app> `);
});
router.register(routes.m.yourPosts, () => {
  pageUtils.setTitleAndMainContent([ls.yourPosts], ll.html`<my-posts-app></my-posts-app>`);
});
router.register(routes.m.yourDiscussions, () => {
  pageUtils.setTitleAndMainContent(
    [ls.yourDiscussions],
    ll.html`<my-discussions-app></my-discussions-app>`,
  );
});
router.register(routes.m.yourQuestions, () => {
  pageUtils.setTitleAndMainContent(
    [ls.yourQuestions],
    ll.html`<my-questions-app></my-questions-app>`,
  );
});

router.startOnce();
