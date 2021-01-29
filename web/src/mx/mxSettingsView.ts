import { customElement } from 'lit-element';
import ls from 'ls';
import routes from 'routes';
import { SettingsBaseItem, SettingsBaseView } from '../m/settings/settingsBaseView';

const items: SettingsBaseItem[] = [{ name: ls.usersAndGroups, link: routes.mx.usersAndGroups }];

@customElement('mx-settings-view')
export class MXSettingsView extends SettingsBaseView {
  constructor() {
    super();

    this.items = items;
    this.settingsTitle = ls.adminSettings;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mx-settings-view': MXSettingsView;
  }
}
