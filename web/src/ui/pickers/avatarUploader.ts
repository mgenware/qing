/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import 'qing-overlay';
import { staticMainImage } from 'urls.js';
import 'ui/status/progressView.js';
import '@github/image-crop-element';
import AvatarUploadLoader, { AvatarUploadResponse } from './loaders/avatarUploadLoader.js';
import { QingOverlay } from 'qing-overlay';
import appTask from 'app/appTask.js';
import { appDef } from '@qing/def';

interface ImageCropInfo {
  x: number;
  y: number;
  height: number;
  width: number;
}

@customElement('avatar-uploader')
export class AvatarUploader extends BaseElement {
  static override get styles() {
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

  @property() private imageDataURL: string | null = null;

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

  override firstUpdated() {
    this.hookFileUploadEvents(this.uploadElement);
    this.cropElement.addEventListener('image-crop-change', (e) => this.handleImageCrop(e));
  }

  override render() {
    return html`
      <div>
        <qing-overlay
          id="modalElement"
          ?open=${!!this.imageDataURL}
          closeOnEscDown
          @overlay-close=${this.handleOverlayClose}>
          <div class="m-b-md crop-container">
            <image-crop id="cropElement" src=${this.imageDataURL as string}></image-crop>
          </div>
          <div class="text-center">
            <qing-button @click=${this.handleOKClick}>${globalThis.coreLS.ok}</qing-button>
            <qing-button @click=${this.handleCancelClick} class="m-l-md"
              >${globalThis.coreLS.cancel}</qing-button
            >
          </div>
        </qing-overlay>
        <form id="formElement">
          <div>
            <label class="cursor-pointer">
              <input
                type="file"
                id="uploadElement"
                name=${appDef.formUploadMain}
                accept=".jpg,.jpeg,.png,.webp,.jfif"
                hidden />
              <span class="file-cta">
                <span class="file-icon">
                  <img src=${staticMainImage('upload.svg')} width="16" height="16" />
                </span>
                <span>${globalThis.coreLS.chooseAFileBtn}</span>
              </span>
              <br />
            </label>
          </div>
          <p>${globalThis.coreLS.uploadProfileImgDesc}</p>
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
    this.dispatchEvent(new CustomEvent<AvatarUploadResponse>('avatar-upload', { detail: data }));
  }

  private async handleOKClick() {
    // Close the crop component first. Otherwise, the user might click "OK" again
    // to send an request without file header.
    this.overlayElement.open = false;

    const fd = new FormData(this.formElement);
    if (this.cropInfo) {
      for (const [k, v] of Object.entries(this.cropInfo)) {
        fd.set(k, `${v}`);
      }
    }
    const loader = new AvatarUploadLoader(fd);
    const result = await appTask.critical(loader, globalThis.coreLS.uploading);
    this.resetFileInput();

    if (result.data) {
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

  private handleOverlayClose() {
    // Reset file input when the dialog is closed.
    this.resetFileInput();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'avatar-uploader': AvatarUploader;
  }
}
