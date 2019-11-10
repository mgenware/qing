import { html, customElement, property, css } from 'lit-element';
import { ls, format } from 'ls';
import BaseElement from 'baseElement';
import 'ui/cm/workingView';
import 'ui/pickers/avatarUploader';
import 'ui/cm/loadingView';
import 'ui/cm/fixedView';
import SetProfileInfoLoader from './loaders/setProfileInfoLoader';
import Status from 'lib/status';
import app from 'app';
import { GetProfileInfoLoader } from './loaders/getProfileInfoLoader';
import AvatarUploadResponse from 'ui/pickers/avatarUploadResponse';
import routes from 'routes';
import 'lit-button';

@customElement('edit-profile-app')
export class EditProfileApp extends BaseElement {
  static get styles() {
    return [super.styles, css``];
  }

  @property() nick = '';
  @property() url = '';
  @property() company = '';
  @property() location = '';
  @property({ type: Object }) loadingStatus = Status.unstarted();
  @property({ type: Object }) setInfoStatus = Status.unstarted();
  @property({ type: Boolean }) isUploadingAvatar = false;
  @property() avatarURL = '';
  setInfoLoader!: SetProfileInfoLoader;

  async firstUpdated() {
    await this.reloadData();
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
      <fixed-view .height=${'400px'}>
        <loading-view
          .status=${loadingStatus}
          .canRetry=${true}
          @onRetry=${this.handleLoadingRetry}
        ></loading-view
      ></fixed-view>
    `;
  }

  renderContent() {
    return html`
      <div>
        <working-view .isWorking=${this.isUploadingAvatar}>
          <div>
            <div class="section">${ls.profilePicture}</div>
            <div>
              <p>
                <img
                  src=${this.avatarURL}
                  width="250"
                  height="250"
                  style="border: 1px solid #ededed"
                />
              </p>
              <div class="mt-3">
                <avatar-uploader
                  .postURL=${routes.sr.profile.setAvatar}
                  @onComplete=${this.handleAvatarUploadComplete}
                  @onError=${this.handleAvatarUploadError}
                ></avatar-uploader>
              </div>
            </div>
          </div>
        </working-view>
        <working-view .status=${this.setInfoStatus}>
          <div class="form">
            <div class="section">${ls.profile}</div>
            <div>
              <label for="nick-tbx">${ls.name}</label>
              <input
                id="nick-tbx"
                type="text"
                value=${this.nick}
                @change=${(e: any) => (this.nick = e.target.value)}
              />

              <label for="website-tbx">${ls.url}</label>
              <input
                id="website-tbx"
                type="url"
                value=${this.url}
                @change=${(e: any) => (this.url = e.target.value)}
              />

              <label for="company-tbx">${ls.company}</label>
              <input
                id="company-tbx"
                type="text"
                value=${this.company}
                @change=${(e: any) => (this.company = e.target.value)}
              />

              <label for="addr-tbx">${ls.location}</label>
              <input
                id="addr-tbx"
                type="text"
                value=${this.location}
                @change=${(e: any) => (this.location = e.target.value)}
              />

              <lit-button
                class="is-success"
                @click=${this.handleSaveProfileClick}
              >
                ${ls.save}
              </lit-button>
            </div>
          </div>
        </working-view>
      </div>
    `;
  }

  private async reloadData() {
    try {
      const loader = new GetProfileInfoLoader();
      const res = await app.runActionAsync(loader);
      if (res.isSuccess) {
        const profile = res.getResult();
        this.nick = profile.Name || '';
        this.url = profile.Website || '';
        this.company = profile.Company || '';
        this.location = profile.Location || '';
        this.avatarURL = profile.IconURL || '';
      }
    } catch (err) {
      await app.alert.error(err.message);
    }
  }

  private async handleSaveProfileClick() {
    try {
      if (!this.nick) {
        throw new Error(format('pPlzEnterThe', ls.name));
      }
      const loader = new SetProfileInfoLoader(
        this.nick,
        this.url,
        this.company,
        this.location,
      );
      loader.statusChanged = status => {
        this.setInfoStatus = status;
      };
      await app.runActionAsync(loader, ls.saving);
      await app.alert.successToast(ls.profileUpdated);
    } catch (err) {
      await app.alert.error(err.message);
    }
  }

  private async handleLoadingRetry() {
    await this.reloadData();
  }

  private async handleAvatarUploadError(e: CustomEvent<string>) {
    const msg = e.detail;
    await app.alert.error(msg);
  }

  private async handleAvatarUploadComplete(
    e: CustomEvent<AvatarUploadResponse>,
  ) {
    const resp = e.detail;
    this.avatarURL = resp.iconL || '';

    // Update user data
    app.state.updateUser(user => {
      if (user) {
        user.iconURL = resp.iconL || '';
        return user;
      }
      return null;
    });
  }
}
