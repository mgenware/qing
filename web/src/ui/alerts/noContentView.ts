/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import ls from 'ls';
import './noticeView';

@ll.customElement('no-content-view')
export class NoContentView extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: block;
        }
      `,
    ];
  }

  render() {
    return ll.html` <notice-view>${ls.noContentAvailable}</notice-view> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'no-content-view': NoContentView;
  }
}
