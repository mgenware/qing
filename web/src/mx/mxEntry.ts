import { html, TemplateResult } from 'lit-element';
import ls from 'ls';
import routes from 'routes';
import app from 'app';
import './userMgr/userMgrApp';
import './mxSettingsView';
import { MiniURLRouter } from 'lib/miniURLRouter';

const router = new MiniURLRouter();

function loadSettingsContent(selectedItem: string, content: TemplateResult) {
  app.page.setTitleAndMainContent(
    [selectedItem, ls.adminSettings],
    html`<mx-settings-view .selectedItem=${selectedItem}>${content}</mx-settings-view>`,
  );
}

router.register(routes.mx.usersAndGroups, () => {
  loadSettingsContent(ls.usersAndGroups, html` <user-mgr-app></user-mgr-app> `);
});

router.startOnce();
