import app from 'app';
import { MiniURLRouter, MiniURLRouterHandler } from 'lib/miniURLRouter';
import { TemplateResult, html } from 'lit-element';
import routes from 'routes';
import './settings/forumSettingsBaseView';
import { ForumSettingsPages } from './settings/forumSettingsBaseView';
import './settings/general/forumGeneralSettingsApp';
import ls from 'ls';
import ForumSettingsWind from './forumSettingsWind';
import strf from 'bowhead-js';

const settingsRouter = new MiniURLRouter();
const forumSettingsWind = app.state.windData<ForumSettingsWind>();
const fid = forumSettingsWind.EID;

// FR formats the specified route and returns a route with forum EID attached.
function FR(r: string): string {
  return strf(r, fid);
}

function loadSettingsContent(
  selectedPage: ForumSettingsPages,
  title: string,
  content: TemplateResult,
) {
  app.page.setTitleAndMainContent(
    [title],
    html`<forum-settings-base-view .selectedPage=${selectedPage}
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
settingsRouter.register(FR(routes.f.id.settings.general), generalPageHandler);

settingsRouter.startOnce();
