/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import { ls, formatLS } from 'ls';
import 'ui/status/statusOverlay';
import 'ui/pickers/avatarUploader';
import 'ui/status/statusView';
import 'ui/content/headingView';
import 'ui/form/inputView';
import 'ui/editor/editorView';
import LoadingStatus from 'lib/loadingStatus';
import SetForumEditingInfoLoader from './loaders/setForumEditingInfoLoader';
import { GetForumEditingInfoLoader } from './loaders/getForumEditingInfo';
import { CHECK } from 'checks';
import EditorView from 'ui/editor/editorView';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';

const editorElementID = 'editor';

@customElement('forum-general-settings-app')
export class ForumGeneralSettingsApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .profile-img {
          border: 1px solid var(--app-default-separator-color);
        }
      `,
    ];
  }

  @lp.string fid = '';
  @lp.string name = '';
  @lp.object loadingStatus = LoadingStatus.notStarted;
  @lp.bool updateInfoStatus = LoadingStatus.success;
  @lp.string avatarURL = '';

  get descEditorView(): EditorView | null {
    return this.getShadowElement(editorElementID);
  }

  async firstUpdated() {
    CHECK(this.fid);

    await this.reloadDataAsync();
  }

  render() {
    const { loadingStatus } = this;
    return html` ${loadingStatus.isSuccess ? this.renderContent() : this.renderProgress()} `;
  }

  renderProgress() {
    const { loadingStatus } = this;
    return html`
      <status-view
        .status=${loadingStatus}
        .canRetry=${true}
        .progressViewPadding=${'md'}
        @onRetry=${this.handleLoadingRetry}
      ></status-view>
    `;
  }

  renderContent() {
    return html`
      <status-overlay .status=${this.updateInfoStatus}>
        <heading-view>${ls.general}</heading-view>
        <input-view
          required
          label=${ls.name}
          value=${this.name}
          @onChange=${(e: CustomEvent<string>) => (this.name = e.detail)}
        ></input-view>

        <label class="app-form-label m-t-md" for=${editorElementID}>${ls.description}</label>
        <editor-view class="m-t-md" id=${editorElementID}></editor-view>

        <qing-button class="m-t-md" btnStyle="success" @click=${this.handleSaveInfoClick}>
          ${ls.save}
        </qing-button>
      </status-overlay>
    `;
  }

  private async reloadDataAsync() {
    const loader = new GetForumEditingInfoLoader(this.fid);
    const status = await appTask.critical(loader, undefined, (s) => (this.loadingStatus = s));
    if (status.data) {
      const info = status.data;
      this.name = info.name ?? '';
      if (this.descEditorView) {
        this.descEditorView.setContentHTML(info.descHTML ?? '', false);
      }
    }
  }

  private async handleSaveInfoClick() {
    if (!this.descEditorView) {
      return;
    }
    // Validate user inputs.
    try {
      if (!this.name) {
        throw new Error(formatLS(ls.pPlzEnterThe, ls.name));
      }
    } catch (err) {
      await appAlert.error(err.message);
      return;
    }
    const descHTML = this.descEditorView.getContentHTML();
    const loader = new SetForumEditingInfoLoader(this.fid, this.name, descHTML);
    await appTask.critical(loader, ls.saving, (s) => {
      this.updateInfoStatus = s;
    });
  }

  private async handleLoadingRetry() {
    await this.reloadDataAsync();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'forum-general-settings-app': ForumGeneralSettingsApp;
  }
}
