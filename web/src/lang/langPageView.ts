/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import ls, { formatLS } from 'ls';
import 'ui/lists/linkListView';
import langWind, { LangInfo } from './langWind';
import { linkListActiveFilledClass } from 'ui/lists/linkListView';
import appAlert from 'app/appAlert';
import pageUtils from 'app/utils/pageUtils';
import appSettings from 'app/appSettings';

@customElement('lang-page-view')
export class LangPageView extends BaseElement {
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

  tags: LangInfo[] = [];

  constructor() {
    super();

    this.tags = langWind.Langs;
  }

  render() {
    const curLang = ls._lang;
    return html`
      <container-view>
        <h2>${ls.langSettings}</h2>
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
      </container-view>
    `;
  }

  private async handleLangChange(t: LangInfo) {
    const curLang = ls._lang;
    if (t.ID === curLang) {
      return;
    }
    if (await appAlert.confirm(ls.warning, formatLS(ls.doYouWantToChangeLangTo, t.LocalizedName))) {
      appSettings.lang = t.ID;
      pageUtils.reload();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lang-page-view': LangPageView;
  }
}
