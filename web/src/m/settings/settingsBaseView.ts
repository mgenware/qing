import { html } from 'lit-element';
// eslint-disable-next-line import/no-extraneous-dependencies
import { repeat } from 'lit-html/directives/repeat';
import BaseElement from 'baseElement';
import ls from 'ls';
import * as lp from 'lit-props';
import 'ui/lists/linkListView';
import { linkListActiveClass } from 'ui/lists/linkListView';

export interface SettingsBaseItem {
  name: string;
  link: string;
}

export class SettingsBaseView extends BaseElement {
  @lp.number selectedItem = '';
  @lp.string settingsTitle = ls.settings;
  @lp.array items: SettingsBaseItem[] = [];

  render() {
    return html`
      <div class="row">
        <div class="col-md-auto p-b-md">
          <h3>${this.settingsTitle}</h3>
          <link-list-view>
            ${repeat(
              this.items,
              (i) => i.name,
              (i) => this.menuLink(i),
            )}
          </link-list-view>
        </div>
        <div class="col-md">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private menuLink(item: SettingsBaseItem) {
    return html`<a
      class=${this.selectedItem === item.name ? linkListActiveClass : ''}
      href=${item.link}
      >${item.name}</a
    >`;
  }
}
