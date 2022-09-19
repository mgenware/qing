/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, state } from 'll';
import { ls, formatLS } from 'ls';
import 'ui/status/statusOverlay';
import 'ui/pickers/avatarUploader';
import 'ui/content/headingView';
import 'ui/status/statefulPage';
import 'ui/lists/linkListView';
import * as pu from 'lib/pageUtil';
import { StatefulPage } from 'ui/status/statefulPage';
import 'ui/forms/inputView';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';
import 'ui/editing/editorView';
import { GetProfileLangLoader } from './loaders/getProfileLangLoader';
import { GetProfileLangResult } from 'sod/profile/profileLang';
import { linkListActiveFilledClass } from 'ui/lists/linkListView';
import SetProfileLangLoader from './loaders/setProfileLangLoader';

@customElement('lang-settings')
export class LangSettings extends StatefulPage {
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
      <heading-view>${ls.language}</heading-view>
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
    if (await appAlert.confirm(ls.warning, formatLS(ls.doYouWantToChangeLangTo, localizedName))) {
      const loader = new SetProfileLangLoader(lang);
      const status = await appTask.critical(loader, ls.working);
      if (status.isSuccess) {
        pu.reload();
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lang-settings': LangSettings;
  }
}