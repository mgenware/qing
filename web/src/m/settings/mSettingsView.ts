import { customElement } from 'lit-element';
import ls from 'ls';
import routes from 'routes';
import { SettingsBaseItem, SettingsBaseView } from './settingsBaseView';

const items: SettingsBaseItem[] = [{ name: ls.profile, link: routes.m.settings.profile }];

@customElement('m-settings-view')
export class MSettingsView extends SettingsBaseView {
  constructor() {
    super();

    this.items = items;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm-settings-view': MSettingsView;
  }
}
