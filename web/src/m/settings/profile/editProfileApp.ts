import { html, customElement, property } from 'lit-element';
import { ls, format } from 'ls';
import BaseElement from 'baseElement';
import 'ui/views/workingView';
import SetInfoLoader from './loaders/setInfoLoader';
import Status from 'lib/status';
import app from 'app';
import GetInfoLoader from './loaders/getInfoLoader';

@customElement('edit-profile-app')
export class EditProfileApp extends BaseElement {
  @property() nick = '';
  @property() url = '';
  @property() company = '';
  @property() location = '';
  @property() loadingStatus = new Status();
  @property() setInfoStatus = new Status();
  setInfoLoader!: SetInfoLoader;

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
      <loading-view
        .status=${loadingStatus}
        .canRetry=${true}
        @retry=${this.handleLoadingRetry}
      ></loading-view>
    `;
  }

  renderContent() {
    return html`
      <div>
        <working-view .status=${this.setInfoStatus}>
          <article class="message m-t-md is-light">
            <div class="message-header">${ls.profile}</div>
            <div class="message-body">
              <div class="field">
                <label class="label" for="nick-tbx">${ls.name}</label>
                <div class="control">
                  <input
                    id="nick-tbx"
                    type="text"
                    class="input"
                    value=${this.nick}
                    @change=${(e: any) => (this.nick = e.target.value)}
                  />
                </div>
              </div>

              <div class="field">
                <label class="label" for="website-tbx">${ls.url}</label>
                <div class="control">
                  <input
                    id="website-tbx"
                    type="url"
                    class="input"
                    value=${this.url}
                    @change=${(e: any) => (this.url = e.target.value)}
                  />
                </div>
              </div>

              <div class="field">
                <label class="label" for="company-tbx">${ls.company}</label>
                <div class="control">
                  <input
                    id="company-tbx"
                    type="text"
                    class="input"
                    value=${this.company}
                    @change=${(e: any) => (this.company = e.target.value)}
                  />
                </div>
              </div>

              <div class="field">
                <label class="label" for="addr-tbx">${ls.location}</label>
                <div class="control">
                  <input
                    id="addr-tbx"
                    type="text"
                    class="input"
                    value=${this.location}
                    @change=${(e: any) => (this.location = e.target.value)}
                  />
                </div>
              </div>
              <button
                class="button is-success"
                @click=${this.handleSaveProfileClick}
              >
                ${ls.save}
              </button>
            </div>
          </article>
        </working-view>
      </div>
    `;
  }

  private async reloadData() {
    try {
      const loader = new GetInfoLoader();
      loader.statusChanged = status => {
        this.loadingStatus = status;
      };
      await app.runActionAsync(loader);
    } catch (err) {
      await app.alert.error(err.message);
    }
  }

  private async handleSaveProfileClick() {
    try {
      if (!this.nick) {
        throw new Error(format('pCannotBeEmpty', ls.name));
      }
      const loader = new SetInfoLoader(
        this.nick,
        this.url,
        this.company,
        this.location,
      );
      loader.statusChanged = status => {
        this.setInfoStatus = status;
      };
      await app.runActionAsync(loader, ls.saving);
    } catch (err) {
      await app.alert.error(err.message);
    }
  }

  private async handleLoadingRetry() {
    await this.reloadData();
  }
}
