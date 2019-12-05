import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import app from 'app';
import BaseElement from 'baseElement';
import 'ui/cm/progressView';
import AvatarUploadLoader, {
  AvatarUploadResponse,
} from './loaders/AvatarUploadLoader';

@customElement('avatar-uploader')
export class AvatarUploader extends BaseElement {
  @property({ type: Boolean }) isWorking = false;
  @property({ type: Number }) progress = 0;

  formElement!: HTMLFormElement;
  uploadElement!: HTMLInputElement;

  firstUpdated() {
    this.formElement = this.mustGetShadowElement('formElement');
    this.uploadElement = this.mustGetShadowElement('uploadElement');
    this.hookEvents(this.formElement, this.uploadElement);
  }

  render() {
    return html`
      <div>
        <form
          id="formElement"
          class=${this.isWorking ? 'content-disabled' : ''}
        >
          <div>
            <label>
              <input
                type="file"
                id="uploadElement"
                name="avatarInput"
                class="file-input"
                accept=".jpg,.jpeg,.png"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <img
                    src="/static/img/main/upload.svg"
                    width="16"
                    height="16"
                  />
                </span>
                <span>${ls.chooseAFileBtn}</span>
              </span>
              <br />
            </label>
          </div>
          <p><small>${ls.uploadProfileImgDesc}</small></p>
        </form>

        ${this.isWorking
          ? html`
              <div class="m-t-md">
                ${this.progress
                  ? html`
                      <progress-view .progress=${this.progress}></progress-view>
                    `
                  : html``}
              </div>
            `
          : ''}
      </div>
    `;
  }

  private hookEvents(domForm: HTMLFormElement, domFile: HTMLInputElement) {
    domFile.addEventListener('change', async () => {
      this.isWorking = true;
      this.progress = 0;

      const fd = new FormData(domForm);
      const loader = new AvatarUploadLoader(fd);
      await app.runLocalActionAsync(loader, async status => {
        this.isWorking = status.isWorking;
        if (status.error) {
          this.onError(status.error.message);
        } else if (status.data) {
          this.onSuccess(status.data);
        }
      });
    });
  }

  private onError(message: string) {
    this.dispatchEvent(
      new CustomEvent<string>('onError', { detail: message }),
    );
  }

  private onSuccess(data: AvatarUploadResponse) {
    this.dispatchEvent(
      new CustomEvent<AvatarUploadResponse>('onComplete', { detail: data }),
    );
  }
}
