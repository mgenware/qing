import { html, customElement, property } from 'lit-element';
import { DialogButton, QingDialog } from 'qing-dialog-component';
import ls from 'ls';
import BaseElement from 'baseElement';
import app from 'app';
import { staticMainImage } from 'urls';
import 'ui/status/progressView';
import '@github/image-crop-element';
import styles from '@github/image-crop-element/dist/index.css';
import AvatarUploadLoader, { AvatarUploadResponse } from './loaders/avatarUploadLoader';

interface ImageCropInfo {
  x: number;
  y: number;
  height: number;
  width: number;
}

@customElement('avatar-uploader')
export class AvatarUploader extends BaseElement {
  static get styles() {
    return [super.styles, styles];
  }

  @property() private imageDataURL: string | null = null;

  cropInfo: ImageCropInfo | null = null;

  private get formElement(): HTMLFormElement {
    return this.mustGetShadowElement('formElement');
  }

  private get uploadElement(): HTMLInputElement {
    return this.mustGetShadowElement('uploadElement');
  }

  private get modalElement(): QingDialog {
    return this.mustGetShadowElement('modalElement');
  }

  private get cropElement(): HTMLElement {
    return this.mustGetShadowElement('cropElement');
  }

  firstUpdated() {
    this.hookFileUploadEvents(this.uploadElement);
    this.cropElement.addEventListener('image-crop-change', (e) => this.handleImageCrop(e));
  }

  render() {
    return html`
      <div>
        <qing-dialog
          id="modalElement"
          .isOpen=${!!this.imageDataURL}
          .buttons=${['ok', 'cancel']}
          cancelButtonIndex="1"
          @closed=${this.handleDialogClose}
          @buttonClick=${this.handleCropperModalButtonClick}
        >
          <div class="m-b-md">
            <image-crop id="cropElement" src=${this.imageDataURL as string}></image-crop>
          </div>
        </qing-dialog>
        <form id="formElement">
          <div>
            <label class="cursor-pointer">
              <input
                type="file"
                id="uploadElement"
                name="avatarMain"
                accept=".jpg,.jpeg,.png"
                style="display: none"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <img src=${staticMainImage('upload.svg')} width="16" height="16" />
                </span>
                <span>${ls.chooseAFileBtn}</span>
              </span>
              <br />
            </label>
          </div>
          <p><small>${ls.uploadProfileImgDesc}</small></p>
        </form>
      </div>
    `;
  }

  private hookFileUploadEvents(domFile: HTMLInputElement) {
    domFile.addEventListener('change', async () => {
      if (domFile.files && domFile.files[0] !== undefined) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result !== null) {
            this.imageDataURL = e.target.result as string;
            this.modalElement.open = true;
          }
        };
        reader.readAsDataURL(domFile.files[0]);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleImageCrop(e: any) {
    this.cropInfo = {
      x: e.detail.x,
      y: e.detail.y,
      width: e.detail.width,
      height: e.detail.height,
    };
  }

  private onUpdated(data: AvatarUploadResponse) {
    this.dispatchEvent(
      new CustomEvent<AvatarUploadResponse>('onUpdated', { detail: data }),
    );
  }

  private async handleCropperModalButtonClick(e: CustomEvent<DialogButton>) {
    const button = e.detail;
    if (button?.type === 'ok') {
      const fd = new FormData(this.formElement);
      if (this.cropInfo) {
        for (const [k, v] of Object.entries(this.cropInfo)) {
          fd.set(k, v);
        }
      }
      const loader = new AvatarUploadLoader(fd);
      const result = await app.runGlobalActionAsync(loader, ls.uploading);
      this.resetFileInput();

      if (result.data) {
        this.modalElement.open = false;
        this.onUpdated(result.data);
      }
    }
  }

  // Need to be called whenever a upload is completed or cancelled.
  // Otherwise, selecting the same file twice won't trigger the `change` event.
  private resetFileInput() {
    this.uploadElement.value = '';
  }

  private handleDialogClose(e: CustomEvent<DialogButton>) {
    if (e.detail?.type === 'cancel') {
      // Reset file input when user cancelled the dialog.
      this.resetFileInput();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'avatar-uploader': AvatarUploader;
  }
}
