import { html, TemplateResult } from 'lit-element';
import ls from 'ls';
import routes from 'routes';
import app from 'app';
import './userMgr/userMgrApp';
import '../m/settings/mSettingsView';
import { MiniURLRouter } from 'lib/miniURLRouter';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  app.page.setTitleAndMainContent(
    [selectedItem],
    html`<m-settings-view .selectedItem=${selectedItem}>${content}</m-settings-view>`,
  );
}

router.register(routes.mx.usersAndGroups, () => {
  loadSettingsContent(ls.usersAndGroups, html` <user-mgr-app></user-mgr-app> `);
});

router.startOnce();
