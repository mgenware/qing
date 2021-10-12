/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import 'com/cmt/cmtApp';
import 'ui/qna/voteApp';
import { CHECK } from 'checks';

@customElement('answer-app')
export class AnswerApp extends BaseElement {
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

  @lp.string eid = '';
  @lp.number initialValue = 0;
  @lp.number initialUps = 0;
  @lp.number initialDowns = 0;
  @lp.number initialMyVote = 0;

  firstUpdated() {
    CHECK(this.eid);
  }

  render() {
    return html`
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
