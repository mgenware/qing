import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import BaseElement from 'baseElement';
import AvatarUploadResponse from './avatarUploadResponse';
import { APIResponse } from 'lib/loader';
import 'ui/cm/progressView';

@customElement('avatar-uploader')
export class AvatarUploader extends BaseElement {
  @property() postURL!: string;
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
    domFile.addEventListener('change', () => {
      this.isWorking = true;
      this.progress = 0;

      const fd = new FormData(domForm);
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('progress', e => {
        if (e.lengthComputable) {
          this.progress = Math.round((e.loaded / e.total) * 100);
        }
      });
      xhr.addEventListener('load', () => {
        this.isWorking = false;

        if (xhr.status === 200) {
          let resp: APIResponse;
          try {
            resp = JSON.parse(xhr.responseText) as APIResponse;
          } catch (exp) {
            resp = { code: 1000 };
            resp.message = `${ls.internalErr}: ${xhr.responseText}`;
          }

          if (resp.code) {
            // is error
            const { code } = resp;
            if (code === 10) {
              this.onError(ls.unsupportedImgExtErr, domFile);
            } else if (code === 11) {
              // don't report no-header error, sometimes cancelling the dialog results in this error
              this.onError('', domFile);
            } else if (code === 12) {
              this.onError(ls.exceed5MBErr, domFile);
            } else {
              this.onError(`${resp.message}(${code})`, domFile);
            }
          } else {
            this.onSuccess(resp.data as AvatarUploadResponse);
          }
        } else {
          this.onError(
            `${ls.errOccurred}: ${xhr.statusText} ${xhr.status}`,
            domFile,
          );
        }
      });
      if (!this.postURL) {
        throw new Error('Avatar uploader post URL null');
      }
      xhr.open('POST', this.postURL, true);
      xhr.send(fd);
    });
  }

  private onError(message: string, _: HTMLInputElement) {
    this.dispatchEvent(new CustomEvent<string>('onError', { detail: message }));
  }

  private onSuccess(data: AvatarUploadResponse) {
    this.dispatchEvent(
      new CustomEvent<AvatarUploadResponse>('onComplete', { detail: data }),
    );
  }
}
