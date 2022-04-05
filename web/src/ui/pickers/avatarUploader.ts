/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import 'qing-overlay';
import ls from 'ls';
import { staticMainImage } from 'urls';
import 'ui/status/progressView';
import '@github/image-crop-element';
import AvatarUploadLoader, { AvatarUploadResponse } from './loaders/avatarUploadLoader';
import { QingOverlay } from 'qing-overlay';
import appTask from 'app/appTask';
import { appdef } from '@qing/def';

interface ImageCropInfo {
  x: number;
  y: number;
  height: number;
  width: number;
}

@customElement('avatar-uploader')
export class AvatarUploader extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }
        .crop-container {
          overflow-y: auto;
          border: 1px solid var(--app-default-separator-color);
        }
      `,
    ];
  }

  @lp.string private imageDataURL: string | null = null;

  cropInfo: ImageCropInfo | null = null;

  private get formElement(): HTMLFormElement {
    return this.unsafeGetShadowElement('formElement');
  }

  private get uploadElement(): HTMLInputElement {
    return this.unsafeGetShadowElement('uploadElement');
  }

  private get overlayElement(): QingOverlay {
    return this.unsafeGetShadowElement('modalElement');
  }

  private get cropElement(): HTMLElement {
    return this.unsafeGetShadowElement('cropElement');
  }

  firstUpdated() {
    this.hookFileUploadEvents(this.uploadElement);
    this.cropElement.addEventListener('image-crop-change', (e) => this.handleImageCrop(e));
  }

  render() {
    return html`
      <div>
        <qing-overlay
          id="modalElement"
          .isOpen=${!!this.imageDataURL}
          @escKeyDown=${this.handleCancelClick}
          @openChanged=${this.handleOpenChanged}>
          <div class="m-b-md crop-container">
            <image-crop id="cropElement" src=${this.imageDataURL as string}></image-crop>
          </div>
          <div class="text-center">
            <qing-button @click=${this.handleOKClick}>${ls.ok}</qing-button>
            <qing-button @click=${this.handleCancelClick} class="m-l-md">${ls.cancel}</qing-button>
          </div>
        </qing-overlay>
        <form id="formElement">
          <div>
            <label class="cursor-pointer">
              <input
                type="file"
                id="uploadElement"
                name=${appdef.formUploadMain}
                accept=".jpg,.jpeg,.png,.webp,.jfif"
                style="display: none" />
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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    domFile.addEventListener('change', () => {
      if (domFile.files && domFile.files[0] !== undefined) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result !== null) {
            this.imageDataURL = e.target.result as string;
            this.overlayElement.open = true;
          }
        };
        reader.readAsDataURL(domFile.files[0]);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleImageCrop(e: any) {
    this.cropInfo = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      x: e.detail.x,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      y: e.detail.y,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      width: e.detail.width,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      height: e.detail.height,
    };
  }

  private onUpdated(data: AvatarUploadResponse) {
    this.dispatchEvent(new CustomEvent<AvatarUploadResponse>('onUpdated', { detail: data }));
  }

  private async handleOKClick() {
    const fd = new FormData(this.formElement);
    if (this.cropInfo) {
      for (const [k, v] of Object.entries(this.cropInfo)) {
        fd.set(k, `${v}`);
      }
    }
    const loader = new AvatarUploadLoader(fd);
    const result = await appTask.critical(loader, ls.uploading);
    this.resetFileInput();

    if (result.data) {
      this.overlayElement.open = false;
      this.onUpdated(result.data);
    }
  }

  private handleCancelClick() {
    this.overlayElement.open = false;
  }

  // Need to be called whenever a upload is completed or cancelled.
  // Otherwise, selecting the same file twice won't trigger the `change` event.
  private resetFileInput() {
    this.uploadElement.value = '';
  }

  private handleOpenChanged(e: CustomEvent<boolean>) {
    if (!e.detail) {
      // Reset file input when the dialog is closed.
      this.resetFileInput();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'avatar-uploader': AvatarUploader;
  }
}
