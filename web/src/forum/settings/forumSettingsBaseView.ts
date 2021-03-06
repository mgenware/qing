/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import ls from 'ls';
import 'ui/lists/linkListView';
import { linkListActiveClass } from 'ui/lists/linkListView';
import { CHECK } from 'checks';
import routes from 'routes';
import strf from 'bowhead-js';

export enum ForumSettingsPages {
  general,
  mods,
}

@customElement('forum-settings-base-view')
export class ForumSettingsBaseView extends BaseElement {
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

  @lp.number selectedPage = ForumSettingsPages.general;
  @lp.string fid = '';

  firstUpdated() {
    CHECK(this.fid);
  }

  render() {
    const { fid } = this;
    return html`
      <div class="row">
        <div class="col-md-auto p-b-md">
          <h3>${ls.settings}</h3>
          <link-list-view>
            ${this.menuLink(
              ForumSettingsPages.general,
              strf(routes.f.id.settingsRoot, fid),
              ls.general,
            )}
            ${this.menuLink(
              ForumSettingsPages.mods,
              strf(routes.f.id.settings.mods, fid),
              ls.moderators,
            )}
          </link-list-view>
        </div>
        <div class="col-md">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private menuLink(page: ForumSettingsPages, link: string, value: string) {
    return html`<a class=${this.selectedPage === page ? linkListActiveClass : ''} href=${link}
      >${value}</a
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'forum-settings-base-view': ForumSettingsBaseView;
  }
}
