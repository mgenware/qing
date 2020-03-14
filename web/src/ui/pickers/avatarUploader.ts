import { html, customElement, property } from 'lit-element';
import ls from 'ls';
import BaseElement from 'baseElement';
import 'ui/cm/progressView';
import '@github/image-crop-element';
import styles from '@github/image-crop-element/index.css';
import 'qing-dialog-component';
import AvatarUploadLoader, {
  AvatarUploadResponse,
} from './loaders/AvatarUploadLoader';
import app from 'app';
import { QingDialog, IsOpenChangedArgs } from 'qing-dialog-component';
import { staticMainImage } from 'urls';

interface ImageCropInfo {
  x: number;
  y: number;
  height: number;
  width: number;
}

@customElement('avatar-uploader')
export class AvatarUploader extends BaseElement {
  static get styles() {
    return styles;
  }

  @property() private imageDataURL: string | null = null;

  formElement!: HTMLFormElement;
  uploadElement!: HTMLInputElement;
  modalElement!: QingDialog;
  cropElement!: HTMLElement;
  cropInfo: ImageCropInfo | null = null;

  firstUpdated() {
    this.formElement = this.mustGetShadowElement('formElement');
    this.uploadElement = this.mustGetShadowElement('uploadElement');
    this.modalElement = this.mustGetShadowElement('modalElement');
    this.cropElement = this.mustGetShadowElement('cropElement');
    this.hookFileUploadEvents(this.uploadElement);
    this.cropElement.addEventListener('image-crop-change', e =>
      this.handleImageCrop(e),
    );
    this.modalElement.addEventListener('closed', ((
      e: CustomEvent<IsOpenChangedArgs>,
    ) => this.handleCropperModalClose(e)) as any);
  }

  render() {
    return html`
      <div>
        <qing-dialog
          id="modalElement"
          .isOpen=${!!this.imageDataURL}
          .buttons=${['ok', 'cancel']}
          @closed=${this.handleDialogClose}
        >
          <div>
            <image-crop
              id="cropElement"
              src=${this.imageDataURL as string}
            ></image-crop>
          </div>
        </qing-dialog>
        <form id="formElement">
          <div>
            <label>
              <input
                type="file"
                id="uploadElement"
                name="avatarMain"
                class="file-input"
                accept=".jpg,.jpeg,.png"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <img
                    src=${staticMainImage('upload.svg')}
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
      </div>
    `;
  }

  private hookFileUploadEvents(domFile: HTMLInputElement) {
    domFile.addEventListener('change', async () => {
      if (domFile.files && domFile.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
          if (e.target && e.target.result) {
            this.imageDataURL = e.target.result as string;
            this.modalElement.isOpen = true;
          }
        };
        reader.readAsDataURL(domFile.files[0]);
      }
    });
  }

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

  private async handleCropperModalClose(e: CustomEvent<IsOpenChangedArgs>) {
    const { button } = e.detail;
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
        this.modalElement.isOpen = false;
        this.onUpdated(result.data);
      }
    }
  }

  // Need to be called whenever a upload is completed or cancelled.
  // Otherwise, selecting the same file twice won't trigger the `change` event.
  private resetFileInput() {
    this.uploadElement.value = '';
  }

  private handleDialogClose(e: CustomEvent<IsOpenChangedArgs>) {
    if (e.detail.button?.type === 'cancel') {
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
