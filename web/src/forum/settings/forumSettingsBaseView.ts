/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import 'ui/lists/linkListView';
import { linkListActiveClass } from 'ui/lists/linkListView';
import { CHECK } from 'checks';
import * as fRoute from '@qing/routes/forum';

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

  @property({ type: Number }) selectedPage = ForumSettingsPages.general;
  @property() fid = '';

  override firstUpdated() {
    CHECK(this.fid);
  }

  override render() {
    const { fid } = this;
    return html`
      <div class="root">
        <div>
          <h3>${globalThis.coreLS.settings}</h3>
          <link-list-view>
            ${this.menuLink(
              ForumSettingsPages.general,
              fRoute.getSettings(fid),
              globalThis.coreLS.generalSettings,
            )}
            ${this.menuLink(
              ForumSettingsPages.mods,
              fRoute.getSettingsMods(fid),
              globalThis.coreLS.moderators,
            )}
          </link-list-view>
        </div>
        <div>
          <slot></slot>
        </div>
      </div>
    `;
  }

  private menuLink(page: ForumSettingsPages, link: string, value: string) {
    return html`<link-button
      class=${this.selectedPage === page ? linkListActiveClass : ''}
      href=${link}
      >${value}</link-button
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'forum-settings-base-view': ForumSettingsBaseView;
  }
}
