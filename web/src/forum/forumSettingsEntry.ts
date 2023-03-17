/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { MiniURLRouter, MiniURLRouterHandler } from 'lib/miniURLRouter';
import { html, TemplateResult } from 'll';
import * as fRoute from '@qing/routes/forum';
import './settings/forumSettingsBaseView';
import { ForumSettingsPages } from './settings/forumSettingsBaseView';
import './settings/general/forumGeneralSettingsApp';
import ForumSettingsWind from './forumSettingsWind';
import { CHECK } from 'checks';
import appPageState from 'app/appPageState';
import * as pu from 'lib/pageUtil';

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
