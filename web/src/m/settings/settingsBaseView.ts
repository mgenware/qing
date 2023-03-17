/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, html, property, css } from 'll.js';
import { repeat } from 'lit/directives/repeat.js';
import 'ui/lists/linkListView.js';
import { linkListActiveClass } from 'ui/lists/linkListView.js';

export interface SettingsBaseItem {
  name: string;
  link: string;
}

export class SettingsBaseView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        .root {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 0.8rem;
        }

        @media (min-width: 768px) {
          .root {
            grid-template-columns: auto 1fr;
            grid-gap: 2rem;
          }
        }
      `,
    ];
  }

  @property() selectedItem = '';
  @property() settingsTitle = '';
  @property({ type: Array }) items: readonly SettingsBaseItem[] = [];

  override render() {
    return html`
      <div class="root br-lpane">
        <div>
          <h3>${this.settingsTitle}</h3>
          <link-list-view>
            ${repeat(
              this.items,
              (i) => i.name,
              (i) => this.menuLink(i),
            )}
          </link-list-view>
        </div>
        <div class="br-rpane">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private menuLink(item: SettingsBaseItem) {
    return html`<link-button
      class=${this.selectedItem === item.name ? linkListActiveClass : ''}
      href=${item.link}
      >${item.name}</link-button
    >`;
  }
}
