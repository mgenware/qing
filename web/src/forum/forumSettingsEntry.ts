/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { MiniURLRouter, MiniURLRouterHandler } from 'lib/miniURLRouter';
import { TemplateResult, html } from 'll';
import routes from 'routes';
import './settings/forumSettingsBaseView';
import { ForumSettingsPages } from './settings/forumSettingsBaseView';
import './settings/general/forumGeneralSettingsApp';
import ls from 'ls';
import ForumSettingsWind from './forumSettingsWind';
import strf from 'bowhead-js';
import { CHECK } from 'checks';
import appPageState from 'app/appPageState';
import pageUtils from 'app/utils/pageUtils';

const settingsRouter = new MiniURLRouter();
const forumSettingsWind = appPageState.windData<ForumSettingsWind>();
const fid = forumSettingsWind.EID;
CHECK(fid);

// FR formats the specified route and returns a route with forum EID attached.
function FR(r: string): string {
  return strf(r, fid);
}

function loadSettingsContent(
  selectedPage: ForumSettingsPages,
  title: string,
  content: TemplateResult,
) {
  pageUtils.setTitleAndMainContent(
    [title],
    html`<forum-settings-base-view .fid=${fid} .selectedPage=${selectedPage}
      >${content}</forum-settings-base-view
    >`,
  );
}

const generalPageHandler: MiniURLRouterHandler = () => {
  loadSettingsContent(
    ForumSettingsPages.general,
    ls.general,
    html` <forum-general-settings-app .fid=${fid}></forum-general-settings-app> `,
  );
};
settingsRouter.register(FR(routes.f.id.settingsRoot), generalPageHandler);

settingsRouter.startOnce();
