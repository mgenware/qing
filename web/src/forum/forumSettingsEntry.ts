/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { MiniURLRouter, MiniURLRouterHandler } from 'lib/miniURLRouter.js';
import { html, TemplateResult } from 'll.js';
import * as fRoute from '@qing/routes/forum.js';
import './settings/forumSettingsBaseView';
import { ForumSettingsPages } from './settings/forumSettingsBaseView.js';
import './settings/general/forumGeneralSettingsApp.js';
import ForumSettingsWind from './forumSettingsWind.js';
import { CHECK } from 'checks.js';
import appPageState from 'app/appPageState.js';
import * as pu from 'lib/pageUtil.js';

const settingsRouter = new MiniURLRouter();
const forumSettingsWind = appPageState.windData<ForumSettingsWind>();
const fid = forumSettingsWind.EID;
CHECK(fid);

function loadSettingsContent(
  selectedPage: ForumSettingsPages,
  title: string,
  content: TemplateResult,
) {
  pu.setTitleAndMainContent(
    [title],
    html`<forum-settings-base-view .fid=${fid} .selectedPage=${selectedPage}
      >${content}</forum-settings-base-view
    >`,
  );
}

const generalPageHandler: MiniURLRouterHandler = () => {
  loadSettingsContent(
    ForumSettingsPages.general,
    globalThis.coreLS.generalSettings,
    html` <forum-general-settings-app .fid=${fid}></forum-general-settings-app> `,
  );
};
settingsRouter.register(fRoute.getSettings(fid), generalPageHandler);

settingsRouter.startOnce();
