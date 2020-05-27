import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import app from 'app';
import { ls, formatLS } from 'ls';
import BaseElement from 'baseElement';
import 'ui/cm/statusOverlay';
import 'ui/pickers/avatarUploader';
import 'ui/cm/statusView';
import 'ui/cm/centeredView';
import 'lit-button';
import { AvatarUploadResponse } from 'ui/pickers/loaders/AvatarUploadLoader';
import LoadingStatus from 'lib/loadingStatus';
import { GetProfileInfoLoader } from './loaders/getProfileInfoLoader';
import SetProfileInfoLoader from './loaders/setProfileInfoLoader';

@customElement('edit-profile-app')
export class EditProfileApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .profile-img {
          border: 1px solid var(--default-separator-color);
        }
      `,
    ];
  }

  @lp.string name = '';
  @lp.string url = '';
  @lp.string company = '';
  @lp.string location = '';
  @lp.object loadingStatus = LoadingStatus.empty;
  @lp.bool updateInfoStatus = LoadingStatus.success;
  @lp.string avatarURL = '';
  setInfoLoader!: SetProfileInfoLoader;

  async firstUpdated() {
    await this.reloadDataAsync();
  }

  render() {
    const { loadingStatus } = this;
    return html`
      ${loadingStatus.isSuccess ? this.renderContent() : this.renderProgress()}
    `;
  }

  renderProgress() {
    const { loadingStatus } = this;
    return html`
      <centered-view .height=${'400px'}>
        <static-view
          .status=${loadingStatus}
          .canRetry=${true}
          @onRetry=${this.handleLoadingRetry}
        ></static-view
      ></centered-view>
    `;
  }

  renderContent() {
    return html`
      <div>
        <div class="section is-info">${ls.profilePicture}</div>
        <div>
          <p>
            <img
              src=${this.avatarURL}
              width="250"
              height="250"
              class="avatar-l profile-img"
            />
          </p>
          <div class="m-t-md">
            <avatar-uploader
              @onUpdated=${this.handleAvatarUploaded}
            ></avatar-uploader>
          </div>
        </div>
        <status-overlay .status=${this.updateInfoStatus}>
          <div class="form">
            <div class="section is-info">${ls.profile}</div>
            <div>
              <label for="nick-tbx">${ls.name}</label>
              <input
                id="nick-tbx"
                type="text"
                value=${this.name}
                @input=${(e: Event) =>
                  (this.name = (e.target as HTMLInputElement).value)}
              />

              <label for="website-tbx">${ls.url}</label>
              <input
                id="website-tbx"
                type="url"
                value=${this.url}
                @input=${(e: Event) =>
                  (this.url = (e.target as HTMLInputElement).value)}
              />

              <label for="company-tbx">${ls.company}</label>
              <input
                id="company-tbx"
                type="text"
                value=${this.company}
                @input=${(e: Event) =>
                  (this.company = (e.target as HTMLInputElement).value)}
              />

              <label for="addr-tbx">${ls.location}</label>
              <input
                id="addr-tbx"
                type="text"
                value=${this.location}
                @input=${(e: any) => (this.location = e.target.value)}
              />

              <lit-button
                class="is-success-btn"
                @click=${this.handleSaveProfileClick}
              >
                ${ls.save}
              </lit-button>
            </div>
          </div>
        </status-overlay>
      </div>
    `;
  }

  private async reloadDataAsync() {
    const loader = new GetProfileInfoLoader();
    const status = await app.runGlobalActionAsync(
      loader,
      undefined,
      (s) => (this.loadingStatus = s),
    );
    if (status.data) {
      const profile = status.data;
      this.name = profile.name || '';
      this.url = profile.website || '';
      this.company = profile.company || '';
      this.location = profile.location || '';
      this.avatarURL = profile.iconURL || '';
    }
  }

  private async handleSaveProfileClick() {
    // Validate user inputs.
    try {
      if (!this.name) {
        throw new Error(formatLS(ls.pPlzEnterThe, ls.name));
      }
    } catch (err) {
      await app.alert.error(err.message);
    }
    const loader = new SetProfileInfoLoader(
      this.name,
      this.url,
      this.company,
      this.location,
    );
    const status = await app.runGlobalActionAsync(loader, ls.saving, (s) => {
      this.updateInfoStatus = s;
    });
    if (status.isSuccess) {
      await app.alert.successToast(ls.profileUpdated);
    }
  }

  private async handleLoadingRetry() {
    await this.reloadDataAsync();
  }

  private async handleAvatarUploaded(e: CustomEvent<AvatarUploadResponse>) {
    const resp = e.detail;
    this.avatarURL = resp.iconL || '';

    // Update user data.
    app.state.updateUser((user) => {
      if (user) {
        // eslint-disable-next-line no-param-reassign
        user.iconURL = resp.iconL || '';
        return user;
      }
      return null;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-profile-app': EditProfileApp;
  }
}
