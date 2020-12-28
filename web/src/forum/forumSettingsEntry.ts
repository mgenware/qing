import app from 'app';
import { MiniURLRouter } from 'lib/miniURLRouter';
import { TemplateResult, html } from 'lit-element';
import './settings/forumSettingsBaseView';
import { ForumSettingsPages } from './settings/forumSettingsBaseView';

const settingsRouter = new MiniURLRouter();

function loadSettingsContent(
  selectedPage: ForumSettingsPages,
  title: string,
  content: TemplateResult,
) {
  app.page.setPageContent(
    title,
    html`<forum-settings-base-view .selectedPage=${selectedPage}
      >${content}</forum-settings-base-view
    >`,
  );
}
