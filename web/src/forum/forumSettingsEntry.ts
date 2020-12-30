import app from 'app';
import { MiniURLRouter } from 'lib/miniURLRouter';
import { TemplateResult, html } from 'lit-element';
import routes from 'routes';
import './settings/forumSettingsBaseView';
import { ForumSettingsPages } from './settings/forumSettingsBaseView';
import './settings/general/forumGeneralSettingsApp';
import strf from 'bowhead-js';
import ls from 'ls';

const settingsRouter = new MiniURLRouter();

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

settingsRouter.register(strf(routes.f.id.settings.general, ':fid'), (args) => {
  const fid = args.fid as string;
  if (!fid) {
    return;
  }
  loadSettingsContent(
    ForumSettingsPages.general,
    ls.general,
    html` <forum-general-settings-app .fid=${fid}></forum-general-settings-app> `,
  );
});
