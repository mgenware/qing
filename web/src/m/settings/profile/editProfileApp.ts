import { html, customElement, property } from 'lit-element';
import { ls, format } from 'ls';
import BaseElement from 'baseElement';
import 'ui/views/workingView';
import SetInfoLoader from './loaders/setInfoLoader';
import Status from 'lib/status';
import app from 'app';

@customElement('edit-profile-app')
export class EditProfileApp extends BaseElement {
  @property() nick = '';
  @property() url = '';
  @property() company = '';
  @property() location = '';
  @property() setInfoStatus = new Status();
  setInfoLoader!: SetInfoLoader;

  render() {
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
                    onchange=${(e: any) => (this.nick = e.target.value)}
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
                    onchange=${(e: any) => (this.url = e.target.value)}
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
                    onchange=${(e: any) => (this.company = e.target.value)}
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
                    onchange=${(e: any) => (this.location = e.target.value)}
                  />
                </div>
              </div>
              <button
                class="button is-success"
                onclick=${this.handleSaveProfileClick}
              >
                ${ls.save}
              </button>
            </div>
          </article>
        </working-view>
      </div>
    `;
  }

  private async handleSaveProfileClick() {
    try {
      if (!this.nick) {
        throw new Error(format('pCannotBeEmpty', ls.content));
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
}
