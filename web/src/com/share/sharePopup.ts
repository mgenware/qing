/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import appAlert from 'app/appAlert';
import { ERR } from 'checks';
import { BaseElement, customElement, html, css, property, state } from 'll';
import ls from 'ls';

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
          color: var(--app-default-fore-color);
          background-color: var(--app-default-back-color);
          width: 100%;
          display: block;
          border: 1px solid var(--app-default-separator-color);
        }

        .link-root {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 0.8rem;
        }

        @media (min-width: 768px) {
          .link-root {
            grid-template-columns: 1fr auto;
            grid-gap: 1rem;
          }
        }
      `,
    ];
  }

  @property() link = '';
  @property({ type: Boolean }) open = false;

  @state() _showCopied = false;
  @state() _absLink = '';

  get absLink() {
    return `${window.location.origin}${this.link}`;
  }

  override render() {
    return html`
      <qing-overlay .open=${this.open} @overlay-esc-down=${this.onClose}>
        <h3>${ls.link}</h3>
        <div class="link-root">
          <input type="text" value=${this.absLink} readonly />
          <qing-button ?disabled=${this._showCopied} @click=${this.handleCopyClick}
            >${this._showCopied ? ls.copied : ls.copy}</qing-button
          >
        </div>
        <div style="text-align:center">
          <qing-button autofocus class="m-t-md" @click=${this.onClose}> ${ls.ok} </qing-button>
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

  private onClose() {
    this.dispatchEvent(new CustomEvent('share-popup-close'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'share-popup': SharePopup;
  }
}
