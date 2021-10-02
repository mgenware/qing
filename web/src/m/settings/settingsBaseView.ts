/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import { repeat } from 'lit/directives/repeat.js';
import 'ui/lists/linkListView';
import { linkListActiveClass } from 'ui/lists/linkListView';

export interface SettingsBaseItem {
  name: string;
  link: string;
}

export class SettingsBaseView extends ll.BaseElement {
  @ll.number selectedItem = '';
  @ll.string settingsTitle = '';
  @ll.array items: SettingsBaseItem[] = [];

  render() {
    return ll.html`
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
    return ll.html`<a
      class=${this.selectedItem === item.name ? linkListActiveClass : ''}
      href=${item.link}
      >${item.name}</a
    >`;
  }
}
