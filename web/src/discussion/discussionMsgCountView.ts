/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import ls, { formatLS } from 'ls';
import discussionWind from './discussionWind';

@ll.customElement('discussion-msg-count-view')
export class DiscussionMsgCountView extends ll.BaseElement {
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
    return ll.html`
      <div>
        <h2>${formatLS(ls.numOfMsgs, discussionWind.ReplyCount)}</h2>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'discussion-msg-count-view': DiscussionMsgCountView;
  }
}
