/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, when, property } from 'll';
import { CHECK } from 'checks';
import ls from 'ls';
import LoadingStatus from 'lib/loadingStatus';
import 'ui/form/checkBox';
import 'ui/status/statusView';
import 'ui/content/headingView';
import 'ui/status/statefulPage';
import 'ui/alerts/alertView';
import { StatefulPage } from 'ui/status/statefulPage';
import GetSiteSettingsLoader from './loaders/getSiteSettingsLoader';
import UpdateSiteSettingsLoader from './loaders/updateSiteSettingsLoader';
import appTask from 'app/appTask';
import { appdef } from '@qing/def';
import { CommunityRawSettings } from 'sod/app/appRawSettings';

@customElement('community-settings-page')
export class CommunitySettingsPage extends StatefulPage {
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

  @property({ type: Boolean }) savingStatus = LoadingStatus.success;
  @property({ type: Boolean }) enableCommunityMode = false;
  @property({ type: Boolean }) forumsEnabled = false;
  @property({ type: Boolean }) forumGroupsEnabled = false;
  @property({ type: Boolean }) needRestart = false;

  override renderContent() {
    return html`
      <status-overlay .status=${this.savingStatus}>
        <heading-view>${ls.forums}</heading-view>
        ${when(
          this.needRestart,
          () => html`<alert-view alertStyle="warning">${ls.restartServerToTakeEffect}</alert-view>`,
        )}
        <p>
          <check-box
            .checked=${this.enableCommunityMode}
            @checked=${(e: CustomEvent<boolean>) => (this.enableCommunityMode = e.detail)}
            >${ls.enableCommunityMode}</check-box
          >
        </p>
        <p>
          <check-box
            .checked=${this.forumsEnabled}
            @checked=${(e: CustomEvent<boolean>) => (this.forumsEnabled = e.detail)}
            >${ls.enableForums}</check-box
          >
        </p>
        <p>
          <check-box
            .checked=${this.forumGroupsEnabled}
            .disabled=${!this.forumsEnabled}
            @checked=${(e: CustomEvent<boolean>) => (this.forumGroupsEnabled = e.detail)}
            >${ls.enableForumGroups}</check-box
          >
        </p>
        <qing-button btnStyle="success" @click=${this.handleSaveClick}> ${ls.save} </qing-button>
      </status-overlay>
    `;
  }

  override async reloadStatefulPageDataAsync() {
    const loader = new GetSiteSettingsLoader(appdef.keyCommunitySettings);
    const status = await appTask.local(loader, (s) => (this.loadingStatus = s));
    if (status.data) {
      const settings = status.data.settings as CommunityRawSettings | undefined;
      CHECK(settings);
      this.enableCommunityMode = !!settings.communityEnabled;
      this.forumsEnabled = !!settings.forumsEnabled;
      this.forumGroupsEnabled = !!settings.forumGroupsEnabled;
      this.needRestart = !!status.data.need_restart;
    }
  }

  private async handleSaveClick() {
    const communityST: Required<CommunityRawSettings> = {
      communityEnabled: this.enableCommunityMode,
      forumsEnabled: this.forumsEnabled,
      forumGroupsEnabled: this.forumGroupsEnabled,
    };
    const loader = new UpdateSiteSettingsLoader(appdef.keyCommunitySettings, communityST);
    const status = await appTask.critical(loader, ls.saving, (s) => (this.savingStatus = s));
    if (status.isSuccess) {
      this.needRestart = true;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'community-settings-page': CommunitySettingsPage;
  }
}
