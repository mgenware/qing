/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement } from 'll';
import 'com/cmt/cmtApp';
import ls from 'ls';
import 'ui/editor/composerView';
import 'com/postCore/setEntityApp';
import { entityDiscussionMsg } from 'sharedConstants';
import discussionWind from './discussionWind';
import { CHECK } from 'checks';

@customElement('add-discussion-msg-app')
export class AddDiscussionMsgApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  firstUpdated() {
    CHECK(discussionWind.EID);
  }

  render() {
    return html`
      <set-entity-app
        .headerText=${ls.postAMsgToThisDiscussion}
        .entityType=${entityDiscussionMsg}
        .submitButtonText=${ls.send}
        .discussionID=${discussionWind.EID}
        .showTitleInput=${false}
      ></set-entity-app>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-discussion-msg-app': AddDiscussionMsgApp;
  }
}
