/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import ls from 'ls';
import 'ui/alerts/alertView';

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
    return html` <alert-view alertStyle="warning">${ls.restartServerToTakeEffect}</alert-view> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'need-restart-view': NeedRestartView;
  }
}
