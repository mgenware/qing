/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, TemplateResult } from 'll';
import ls from 'ls';
import routes from 'routes';
import './settings/mSettingsView';
import './settings/profile/editProfileApp';
import 'post/setPostApp';
import './postCenter/myPostsApp';
import './postCenter/myDiscussionsApp';
import { MiniURLRouter } from 'lib/miniURLRouter';
import pageUtils from 'app/utils/pageUtils';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  pageUtils.setTitleAndMainContent(
    [selectedItem, ls.settings],
    html`<m-settings-view .selectedItem=${selectedItem}>${content}</m-settings-view>`,
  );
}

router.register(routes.m.settings.profile, () => {
  loadSettingsContent(ls.profile, html` <edit-profile-app></edit-profile-app> `);
});
router.register(routes.m.yourPosts, () => {
  pageUtils.setTitleAndMainContent([ls.yourPosts], html`<my-posts-app></my-posts-app>`);
});
router.register(routes.m.yourDiscussions, () => {
  pageUtils.setTitleAndMainContent(
    [ls.yourDiscussions],
    html`<my-discussions-app></my-discussions-app>`,
  );
});

router.startOnce();
