/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import { ERR } from 'checks.js';
import 'ui/status/statusOverlay';
import 'ui/pickers/avatarUploader';
import 'ui/status/statusView';
import 'ui/content/headingView.js';
import 'ui/forms/inputView';
import 'ui/editing/coreEditor.js';
import LoadingStatus from 'lib/loadingStatus.js';
import SetForumEditingInfoLoader from './loaders/setForumEditingInfoLoader.js';
import { GetForumEditingInfoLoader } from './loaders/getForumEditingInfo.js';
import { CHECK } from 'checks.js';
import CoreEditor from 'ui/editing/coreEditor.js';
import appTask from 'app/appTask.js';
import appAlert from 'app/appAlert.js';
import strf from 'bowhead-js';

const editorElementID = 'editor';

@customElement('forum-general-settings-app')
export class ForumGeneralSettingsApp extends BaseElement {
  static override get styles() {
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

  @property() fid = '';
  @property() forumName = '';
  @property({ type: Object }) loadingStatus = LoadingStatus.notStarted;
  @property({ type: Boolean }) updateInfoStatus = LoadingStatus.success;
  @property() avatarURL = '';

  get descEditorView(): CoreEditor | null {
    return this.getShadowElement(editorElementID);
  }

  override async firstUpdated() {
    CHECK(this.fid);

    await this.reloadDataAsync();
  }

  override render() {
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
        @status-view-retry=${this.handleLoadingRetry}></status-view>
    `;
  }

  renderContent() {
    return html`
      <status-overlay .status=${this.updateInfoStatus}>
        <heading-view>${globalThis.coreLS.generalSettings}</heading-view>
        <input-view
          required
          label=${globalThis.coreLS.name}
          value=${this.forumName}
          @input-change=${(e: CustomEvent<string>) => (this.forumName = e.detail)}></input-view>

        <label class="app-form-label m-t-md" for=${editorElementID}
          >${globalThis.coreLS.description}</label
        >
        <editor-view class="m-t-md" id=${editorElementID}></editor-view>

        <qing-button class="m-t-md" btnStyle="success" @click=${this.handleSaveInfoClick}>
          ${globalThis.coreLS.save}
        </qing-button>
      </status-overlay>
    `;
  }

  private async reloadDataAsync() {
    const loader = new GetForumEditingInfoLoader(this.fid);
    const status = await appTask.critical(loader, undefined, (s) => (this.loadingStatus = s));
    if (status.data) {
      const info = status.data;
      this.forumName = info.name ?? '';
      if (this.descEditorView) {
        this.descEditorView.resetRenderedContent(info.descHTML ?? '');
      }
    }
  }

  private async handleSaveInfoClick() {
    if (!this.descEditorView) {
      return;
    }
    // Validate user inputs.
    try {
      if (!this.forumName) {
        throw new Error(strf(globalThis.coreLS.pPlzEnterThe, globalThis.coreLS.name));
      }
    } catch (err) {
      ERR(err);
      await appAlert.error(err.message);
      return;
    }
    const descContent = this.descEditorView.getContent({ summary: false });
    const loader = new SetForumEditingInfoLoader(
      this.fid,
      this.forumName,
      descContent.html,
      descContent.src,
    );
    await appTask.critical(loader, globalThis.coreLS.saving, (s) => {
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
