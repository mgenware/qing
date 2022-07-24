/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import ls from 'ls';
import 'ui/lists/linkListView';
import { linkListActiveClass } from 'ui/lists/linkListView';
import { CHECK } from 'checks';
import * as fRoute from '@qing/routes/d/forum';

export enum ForumSettingsPages {
  general,
  mods,
}

@customElement('forum-settings-base-view')
export class ForumSettingsBaseView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @property({ type: Number }) selectedPage = ForumSettingsPages.general;
  @property() fid = '';

  override firstUpdated() {
    CHECK(this.fid);
  }

  override render() {
    const { fid } = this;
    return html`
      <div class="row">
        <div class="col-md-auto p-b-md">
          <h3>${ls.settings}</h3>
          <link-list-view>
            ${this.menuLink(ForumSettingsPages.general, fRoute.getSettings(fid), ls.general)}
            ${this.menuLink(ForumSettingsPages.mods, fRoute.getSettingsMods(fid), ls.moderators)}
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
