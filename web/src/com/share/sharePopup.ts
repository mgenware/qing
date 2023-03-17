/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import appAlert from 'app/appAlert.js';
import { ERR } from 'checks.js';
import { BaseElement, customElement, html, css, property, state } from 'll.js';

const overlayID = 'overlay';
const okBtnID = 'ok-btn';

@customElement('share-popup')
export class SharePopup extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        input {
          font-size: 1rem;
          max-width: 100%;
          width: 100%;
          line-height: 1.5;
          background-color: #00000012;
          color: var(--app-default-fore-color);
          border: 1px solid var(--app-default-separator-color);
          padding: 0.35rem 0.6rem;
          border-radius: var(--app-surface-radius-sm);
        }

        input:focus {
          outline: 0;
          border-color: var(--app-keyboard-focus-color);
          box-shadow: 0 0 2px var(--app-keyboard-focus-color);
        }

        .link-root {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 1rem;
        }

        @media (min-width: 768px) {
          .link-root {
            grid-template-columns: 1fr auto;
            grid-gap: 0.8rem;
          }
        }
      `,
    ];
  }

  @property() link = '';
  @property({ type: Boolean }) open = false;
  @property({ type: Boolean }) noAutoDomain = false;

  @state() _showCopied = false;
  @state() _absLink = '';

  get absLink() {
    return this.noAutoDomain ? this.link : `${window.location.origin}${this.link}`;
  }

  override focus() {
    this.getShadowElement(okBtnID)?.focus();
  }

  override render() {
    return html`
      <qing-overlay id=${overlayID} .open=${this.open} closeOnEsc>
        <h3>${globalThis.coreLS.link}</h3>
        <div class="link-root">
          <input type="text" value=${this.absLink} readonly />
          <qing-button ?disabled=${this._showCopied} @click=${this.handleCopyClick}
            >${this._showCopied ? globalThis.coreLS.copied : globalThis.coreLS.copy}</qing-button
          >
        </div>
        <div style="text-align:center">
          <qing-button id=${okBtnID} class="m-t-md" @click=${this.okClick}>
            ${globalThis.coreLS.ok}
          </qing-button>
        </div>
      </qing-overlay>
    `;
  }

  private async handleCopyClick() {
    try {
      await navigator.clipboard.writeText(this.absLink);
      this._showCopied = true;
      setTimeout(() => (this._showCopied = false), 2000);
    } catch (err) {
      ERR(err);
      await appAlert.error(err.message);
    }
  }

  private okClick() {
    this.remove();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'share-popup': SharePopup;
  }
}
