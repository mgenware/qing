/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll.js';
import 'ui/lists/linkListView.js';
import langWind, { LangInfo } from './langWind.js';
import { linkListActiveFilledClass } from 'ui/lists/linkListView.js';
import appAlert from 'app/appAlert.js';
import * as pu from 'lib/pageUtil.js';
import AppSettings from 'app/appSettings.js';
import strf from 'bowhead-js';

@customElement('lang-page-view')
export class LangPageView extends BaseElement {
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

  tags: LangInfo[] = [];

  constructor() {
    super();

    this.tags = langWind.Langs;
  }

  override render() {
    const curLang = globalThis.coreLS.qingLang;
    return html`
      <div class="container">
        <h2>${globalThis.coreLS.language}</h2>
        <hr />
        <link-list-view>
          ${this.tags.map(
            (t) =>
              html`<link-button
                @click=${() => this.handleLangChange(t)}
                class=${curLang === t.ID ? linkListActiveFilledClass : ''}
                >${t.Name} (${t.LocalizedName})</link-button
              >`,
          )}
        </link-list-view>
      </div>
    `;
  }

  private async handleLangChange(t: LangInfo) {
    const curLang = globalThis.coreLS.qingLang;
    if (t.ID === curLang) {
      return;
    }
    if (
      await appAlert.confirm(
        globalThis.coreLS.warning,
        strf(globalThis.coreLS.doYouWantToChangeLangTo, t.LocalizedName),
      )
    ) {
      AppSettings.instance.lang = t.ID;
      pu.reload();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lang-page-view': LangPageView;
  }
}
