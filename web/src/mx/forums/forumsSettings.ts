/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css } from 'll';
import * as lp from 'lit-props';
import { CHECK } from 'checks';
import ls from 'ls';
import LoadingStatus from 'lib/loadingStatus';
import 'ui/form/checkBox';
import 'ui/status/statusView';
import 'ui/content/headingView';
import 'ui/status/statefulPage';
import { StatefulPage } from 'ui/status/statefulPage';
import GetSiteSettingsLoader from './loaders/getSiteSettingsLoader';
import UpdateSiteSettingsLoader from './loaders/updateSiteSettingsLoader';
import { forumsSettingsKey } from './loaders/settingsKey';
import ForumsSettingsJSON from './loaders/forumsSettingsJSON';
import appTask from 'app/appTask';

@customElement('forums-settings')
export class ForumsSettings extends StatefulPage {
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

  @lp.bool savingStatus = LoadingStatus.success;
  @lp.bool forumsEnabled = false;
  @lp.bool forumGroupsEnabled = false;
  @lp.bool needRestart = false;

  override renderContent() {
    return html`
      <status-overlay .status=${this.savingStatus}>
        <heading-view>${ls.forums}</heading-view>
        <p>
          <check-box
            .checked=${this.forumsEnabled}
            @check=${(e: CustomEvent<boolean>) => (this.forumsEnabled = e.detail)}
            >${ls.enableForums}</check-box
          >
        </p>
        <p>
          <check-box
            .checked=${this.forumGroupsEnabled}
            .disabled=${!this.forumsEnabled}
            @check=${(e: CustomEvent<boolean>) => (this.forumGroupsEnabled = e.detail)}
            >${ls.enableForumGroups}</check-box
          >
        </p>
        <qing-button btnStyle="success" @click=${this.handleSaveClick}> ${ls.save} </qing-button>
      </status-overlay>
    `;
  }

  override async reloadStatefulPageDataAsync() {
    const loader = new GetSiteSettingsLoader(forumsSettingsKey);
    const status = await appTask.local(loader, (s) => (this.loadingStatus = s));
    if (status.data) {
      const settings = status.data.settings as ForumsSettingsJSON | undefined;
      CHECK(settings);
      this.forumsEnabled = !!settings.forums_enabled;
      this.forumGroupsEnabled = !!settings.forum_groups_enabled;
      this.needRestart = !!status.data.need_restart;
    }
  }

  private async handleSaveClick() {
    const loader = new UpdateSiteSettingsLoader({
      forums_enabled: this.forumsEnabled,
      forum_groups_enabled: this.forumGroupsEnabled,
    });
    const status = await appTask.critical(loader, ls.saving, (s) => (this.savingStatus = s));
    if (status.isSuccess) {
      this.needRestart = true;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'forums-settings': ForumsSettings;
  }
}
