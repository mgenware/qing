/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import ls from 'ls';
import appAlert from 'app/appAlert';

@customElement('profile-id-view')
export class ProfileIDView extends BaseElement {
  static get styles() {
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

  @lp.string value = '';

  render() {
    const { value } = this;
    return html`
      <span>${value} </span>
      <qing-button class="small" @click=${this.handleCopyClick}>${ls.copy}</qing-button>
    `;
  }

  private async handleCopyClick() {
    if (!this.value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.value);
      await appAlert.successToast(ls.copied);
    } catch (err) {
      await appAlert.error(err.message);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'profile-id-view': ProfileIDView;
  }
}
