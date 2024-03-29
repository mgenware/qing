/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, state } from 'll.js';
import 'ui/status/statusOverlay';
import 'ui/pickers/avatarUploader';
import 'ui/content/headingView.js';
import 'ui/status/statefulPage.js';
import 'ui/lists/linkListView.js';
import * as pu from 'lib/pageUtil.js';
import { StatefulPage } from 'ui/status/statefulPage.js';
import 'ui/forms/inputView';
import appTask from 'app/appTask.js';
import appAlert from 'app/appAlert.js';
import 'ui/editing/coreEditor.js';
import { GetProfileLangLoader } from './loaders/getProfileLangLoader.js';
import { GetProfileLangResult } from 'sod/profile.js';
import { linkListActiveFilledClass } from 'ui/lists/linkListView.js';
import SetProfileLangLoader from './loaders/setProfileLangLoader.js';
import strf from 'bowhead-js';

@customElement('lang-st')
export class LangST extends StatefulPage {
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

  @state() private langResult?: GetProfileLangResult;

  override renderContent() {
    if (!this.langResult?.langs) {
      return html``;
    }
    const { autoOptionLS } = this.langResult;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const userLangLower = this.langResult.userLang?.toLocaleLowerCase() || '';
    return html`
      <heading-view>${globalThis.coreLS.language}</heading-view>
      <link-list-view>
        <link-button
          @click=${() => this.changeLangTo(autoOptionLS, '')}
          class=${userLangLower ? '' : linkListActiveFilledClass}
          >${autoOptionLS}</link-button
        >
        ${this.langResult.langs.map(
          (t) =>
            html`<link-button
              @click=${() => this.changeLangTo(t.name, t.id)}
              class=${userLangLower === t.id.toLocaleLowerCase() ? linkListActiveFilledClass : ''}
              >${t.name}</link-button
            >`,
        )}
      </link-list-view>
    `;
  }

  override async reloadStatefulPageDataAsync() {
    const loader = new GetProfileLangLoader();
    const status = await appTask.local(loader, (s) => (this.loadingStatus = s));
    if (status.data) {
      this.langResult = status.data;
    }
  }

  private async changeLangTo(localizedName: string, lang: string) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (lang.toLowerCase() === (this.langResult?.userLang?.toLocaleLowerCase() ?? '')) {
      return;
    }
    if (await appAlert.confirm(strf(globalThis.coreLS.doYouWantToChangeLangTo, localizedName))) {
      const loader = new SetProfileLangLoader(lang);
      const status = await appTask.critical(loader, globalThis.coreLS.working);
      if (status.isSuccess) {
        pu.reload();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lang-st': LangST;
  }
}
