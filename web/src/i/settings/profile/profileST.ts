/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, state } from 'll.js';
import { CHECK, ERR } from 'checks.js';
import 'ui/status/statusOverlay';
import 'ui/pickers/avatarUploader';
import 'ui/content/headingView.js';
import 'ui/status/statefulPage.js';
import { StatefulPage } from 'ui/status/statefulPage.js';
import 'ui/forms/inputView';
import { AvatarUploadResponse } from 'ui/pickers/loaders/avatarUploadLoader.js';
import LoadingStatus from 'lib/loadingStatus.js';
import { GetProfileInfoLoader } from './loaders/getProfileInfoLoader.js';
import SetProfileInfoLoader from './loaders/setProfileInfoLoader.js';
import appPageState from 'app/appPageState.js';
import appTask from 'app/appTask.js';
import appAlert from 'app/appAlert.js';
import 'ui/editing/coreEditor.js';
import CoreEditor, { CoreEditorImpl } from 'ui/editing/coreEditor.js';
import strf from 'bowhead-js';
import { renderCoreEditorContent } from 'ui/editing/coreEditorUtil.js';

const bioEditorID = 'bio-editor';

@customElement('profile-st')
export class ProfileST extends StatefulPage {
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

        input-view {
          margin-bottom: 1rem;
        }

        .bio-editor {
          min-height: 250px;
          margin-bottom: 1rem;
        }
      `,
    ];
  }

  @state() private userName = '';
  @state() private url = '';
  @state() private company = '';
  @state() private location = '';
  @state() private updateInfoStatus = LoadingStatus.success;
  @state() private iconURL = '';

  @state() private bioEditorImpl?: CoreEditorImpl;
  @state() private initialBioContent?: string;

  private get bioEditorEl(): CoreEditor | null {
    return this.getShadowElement<CoreEditor>(bioEditorID);
  }

  override renderContent() {
    return html`
      <heading-view>${globalThis.coreLS.profilePicture}</heading-view>
      <p>
        <img src=${this.iconURL} width="250" height="250" class="avatar-l profile-img" />
      </p>
      <div class="m-t-md">
        <avatar-uploader @avatar-upload=${this.handleAvatarUploaded}></avatar-uploader>
      </div>
      <status-overlay .status=${this.updateInfoStatus}>
        <heading-view>${globalThis.coreLS.profile}</heading-view>
        <input-view
          required
          label=${globalThis.coreLS.name}
          value=${this.userName}
          @input-change=${(e: CustomEvent<string>) => (this.userName = e.detail)}></input-view>

        <input-view
          label=${globalThis.coreLS.url}
          value=${this.url}
          @input-change=${(e: CustomEvent<string>) => (this.url = e.detail)}></input-view>

        <input-view
          label=${globalThis.coreLS.company}
          value=${this.company}
          @input-change=${(e: CustomEvent<string>) => (this.company = e.detail)}></input-view>

        <input-view
          label=${globalThis.coreLS.location}
          value=${this.location}
          @input-change=${(e: CustomEvent<string>) => (this.location = e.detail)}></input-view>

        <label class="app-form-label" for=${bioEditorID}>${globalThis.coreLS.bio}</label>
        <core-editor
          id=${bioEditorID}
          class="bio-editor"
          .initialContent=${this.initialBioContent}
          .editorMode=${appPageState.inputType}
          @core-editor-ready=${this.handleBioEditorReady}></core-editor>

        <qing-button
          btnStyle="success"
          @click=${this.handleSaveProfileClick}
          ?disabled=${!this.bioEditorImpl}>
          ${globalThis.coreLS.save}
        </qing-button>
      </status-overlay>
    `;
  }

  override async reloadStatefulPageDataAsync() {
    const loader = new GetProfileInfoLoader();
    const status = await appTask.local(loader, (s) => (this.loadingStatus = s));
    if (status.data) {
      const profile = status.data;
      this.userName = profile.name ?? '';
      this.url = profile.website ?? '';
      this.company = profile.company ?? '';
      this.location = profile.location ?? '';
      this.iconURL = profile.iconURL;
      this.initialBioContent = profile.bioHTML;
    }
  }

  private handleBioEditorReady(e: CustomEvent<CoreEditorImpl>) {
    this.bioEditorImpl = e.detail;
  }

  private async handleSaveProfileClick() {
    CHECK(this.bioEditorEl);
    // Save button should be disabled when the editor is not ready.
    CHECK(this.bioEditorImpl);

    // Validate user inputs.
    try {
      if (!this.userName) {
        throw new Error(strf(globalThis.coreLS.pPlzEnterThe, globalThis.coreLS.name));
      }
    } catch (err) {
      ERR(err);
      await appAlert.error(err.message);
      return;
    }

    const bioContent = this.bioEditorEl.getContent(this.bioEditorImpl);
    const bioRenderedContent = renderCoreEditorContent(bioContent);
    const loader = new SetProfileInfoLoader(
      this.userName,
      this.url,
      this.company,
      this.location,
      bioRenderedContent.html,
      bioRenderedContent.src,
    );
    const status = await appTask.critical(loader, globalThis.coreLS.saving, (s) => {
      this.updateInfoStatus = s;
    });
    if (status.isSuccess) {
      if (this.userName !== appPageState.user?.name) {
        appPageState.updateUser({ name: this.userName });
      }
      await appAlert.successToast(globalThis.coreLS.profileUpdated);
    }
  }

  private handleAvatarUploaded(e: CustomEvent<AvatarUploadResponse>) {
    const resp = e.detail;
    this.iconURL = resp.iconL || '';

    // Update user data.
    appPageState.updateUser({ iconURL: resp.iconL || '' });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'profile-st': ProfileST;
  }
}
