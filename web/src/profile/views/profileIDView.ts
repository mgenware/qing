/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import { ERR } from 'checks.js';
import appAlert from 'app/appAlert.js';

@customElement('profile-id-view')
export class ProfileIDView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        qing-button::part(button) {
          background-color: none;
          border: 0;
        }
      `,
    ];
  }

  @property() value = '';

  override render() {
    const { value } = this;
    return html`
      <span>${value}</span>
      <qing-button class="small m-l-sm" @click=${this.handleCopyClick}
        >${globalThis.coreLS.copy}</qing-button
      >
    `;
  }

  private async handleCopyClick() {
    if (!this.value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.value);
      await appAlert.successToast(globalThis.coreLS.copied);
    } catch (err) {
      ERR(err);
      await appAlert.error(err.message);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'profile-id-view': ProfileIDView;
  }
}
