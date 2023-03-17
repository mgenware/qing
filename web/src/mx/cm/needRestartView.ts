/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import 'ui/alerts/alertView.js';

@customElement('need-restart-view')
export class NeedRestartView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  @property() headerText = '';
  @property({ type: Boolean }) canRetry = false;

  override render() {
    return html`
      <alert-view alertStyle="warning">${globalThis.coreLS.restartServerToTakeEffect}</alert-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'need-restart-view': NeedRestartView;
  }
}
