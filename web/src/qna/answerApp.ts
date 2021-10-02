/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import 'com/cmt/cmtApp';
import 'ui/qna/voteApp';
import { CHECK } from 'checks';

@ll.customElement('answer-app')
export class AnswerApp extends ll.BaseElement {
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

  @ll.string eid = '';
  @ll.number initialValue = 0;
  @ll.number initialUps = 0;
  @ll.number initialDowns = 0;
  @ll.number initialMyVote = 0;

  firstUpdated() {
    CHECK(this.eid);
  }

  render() {
    return ll.html`
      <div>
        <slot></slot>
        <div class="m-t-md">
          <vote-app
            .hostID=${this.eid}
            .initialUps=${this.initialUps}
            .initialDowns=${this.initialDowns}
            .initialValue=${this.initialValue}
            .initialMyVote=${this.initialMyVote}></vote-app>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'answer-app': AnswerApp;
  }
}
