import { customElement, css } from 'lit-element';
import ls from 'ls';
import routes from 'routes';
import { SettingsBaseItem, SettingsBaseView } from './settingsBaseView';

const items: SettingsBaseItem[] = [{ name: ls.profile, link: routes.m.settings.profile }];

@customElement('m-settings-view')
export class MSettingsView extends SettingsBaseView {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  constructor() {
    super();

    this.items = items;
    this.settingsTitle = ls.settings;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm-settings-view': MSettingsView;
  }
}
