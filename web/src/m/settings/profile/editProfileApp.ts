/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, html, css, property } from 'll';
import { ls, formatLS } from 'ls';
import { ERR } from 'checks';
import 'ui/status/statusOverlay';
import 'ui/pickers/avatarUploader';
import 'ui/content/headingView';
import 'ui/status/statefulPage';
import { StatefulPage } from 'ui/status/statefulPage';
import 'ui/form/inputView';
import { AvatarUploadResponse } from 'ui/pickers/loaders/avatarUploadLoader';
import LoadingStatus from 'lib/loadingStatus';
import { GetProfileInfoLoader } from './loaders/getProfileInfoLoader';
import SetProfileInfoLoader from './loaders/setProfileInfoLoader';
import appPageState from 'app/appPageState';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';
import 'ui/editor/editorView';
import EditorView from 'ui/editor/editorView';

const editorID = 'editor';

@customElement('edit-profile-app')
export class EditProfileApp extends StatefulPage {
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

  @property() name = '';
  @property() url = '';
  @property() company = '';
  @property() location = '';
  @property({ type: Boolean }) updateInfoStatus = LoadingStatus.success;
  @property() avatarURL = '';

  private get editorEl(): EditorView | null {
    return this.getShadowElement<EditorView>(editorID);
  }

  override renderContent() {
    return html`
      <heading-view>${ls.profilePicture}</heading-view>
      <p>
        <img src=${this.avatarURL} width="250" height="250" class="avatar-l profile-img" />
      </p>
      <div class="m-t-md">
        <avatar-uploader @onUpdated=${this.handleAvatarUploaded}></avatar-uploader>
      </div>
      <status-overlay .status=${this.updateInfoStatus}>
        <heading-view>${ls.profile}</heading-view>
        <input-view
          required
          label=${ls.name}
          value=${this.name}
          @onChange=${(e: CustomEvent<string>) => (this.name = e.detail)}></input-view>

        <input-view
          label=${ls.url}
          value=${this.url}
          @onChange=${(e: CustomEvent<string>) => (this.url = e.detail)}></input-view>

        <input-view
          label=${ls.company}
          value=${this.company}
          @onChange=${(e: CustomEvent<string>) => (this.company = e.detail)}></input-view>

        <input-view
          label=${ls.location}
          value=${this.location}
          @onChange=${(e: CustomEvent<string>) => (this.location = e.detail)}></input-view>

        <label class="app-form-label" for=${editorID}>${ls.bio}</label>
        <editor-view id=${editorID} class="bio-editor"></editor-view>

        <qing-button btnStyle="success" @click=${this.handleSaveProfileClick}>
          ${ls.save}
        </qing-button>
      </status-overlay>
    `;
  }

  override async reloadStatefulPageDataAsync() {
    const loader = new GetProfileInfoLoader();
    const status = await appTask.local(loader, (s) => (this.loadingStatus = s));
    if (status.data) {
      const profile = status.data;
      this.name = profile.name ?? '';
      this.url = profile.website ?? '';
      this.company = profile.company ?? '';
      this.location = profile.location ?? '';
      this.avatarURL = profile.iconURL ?? '';
      this.editorEl?.setContentHTML(profile.bioHTML ?? '', false);
    }
  }

  private async handleSaveProfileClick() {
    // Validate user inputs.
    try {
      if (!this.name) {
        throw new Error(formatLS(ls.pPlzEnterThe, ls.name));
      }
    } catch (err) {
      ERR(err);
      await appAlert.error(err.message);
      return;
    }
    const loader = new SetProfileInfoLoader(
      this.name,
      this.url,
      this.company,
      this.location,
      this.editorEl?.getContentHTML() ?? '',
    );
    const status = await appTask.critical(loader, ls.saving, (s) => {
      this.updateInfoStatus = s;
    });
    if (status.isSuccess) {
      if (this.name !== appPageState.user?.name) {
        appPageState.updateUser({ name: this.name });
      }
      await appAlert.successToast(ls.profileUpdated);
    }
  }

  private handleAvatarUploaded(e: CustomEvent<AvatarUploadResponse>) {
    const resp = e.detail;
    this.avatarURL = resp.iconL || '';

    // Update user data.
    appPageState.updateUser({ iconURL: resp.iconL || '' });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-profile-app': EditProfileApp;
  }
}
