import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import ls from 'ls';
import routes from 'routes';
import * as lp from 'lit-props';
import 'ui/lists/linkListView';
import { linkListActiveClass } from 'ui/lists/linkListView';
import app from 'app';

export enum SettingsPages {
  profile,
  userAndGroups,
}

@customElement('settings-base-view')
export class SettingsBaseView extends BaseElement {
  @lp.number selectedPage = SettingsPages.profile;

  render() {
    return html`
      <div class="row">
        <div class="col-md-auto p-b-md">
          <h3>${ls.settings}</h3>
          <link-list-view>
            ${this.menuLink(SettingsPages.profile, routes.m.settings.profile, ls.profile)}
            ${app.state.user?.admin
              ? this.menuLink(
                  SettingsPages.userAndGroups,
                  routes.m.settings.usersAndGroups,
                  ls.usersAndGroups,
                )
              : ''}
          </link-list-view>
        </div>
        <div class="col-md">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private menuLink(page: SettingsPages, link: string, value: string) {
    return html`<a class=${this.selectedPage === page ? linkListActiveClass : ''} href=${link}
      >${value}</a
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'settings-base-view': SettingsBaseView;
  }
}
