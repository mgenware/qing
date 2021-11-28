/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import ls from 'ls';
import LoadingStatus from 'lib/loadingStatus';
import 'ui/form/checkBox';
import 'ui/status/statusOverlay';
import 'ui/status/statusView';
import 'ui/content/headingView';

@customElement('forums-settings')
export class ForumsSettings extends BaseElement {
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

  render() {
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

  private handleSaveClick() {}
}

declare global {
  interface HTMLElementTagNameMap {
    'forums-settings': ForumsSettings;
  }
}
