/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import 'com/cmt/cmtApp';
import 'ui/qna/voteApp';
import { upVoteValue, downVoteValue, noVoteValue } from 'sharedConstants';
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
  @lp.number initialMyVoteString = '';

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
            .initialMyVote=${this.voteStringToValue(this.initialMyVoteString)}
          ></vote-app>
        </div>
      </div>
    `;
  }

  private voteStringToValue(s: string): number {
    switch (s) {
      case 'up':
        return upVoteValue;
      case 'down':
        return downVoteValue;
      default:
        return noVoteValue;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'answer-app': AnswerApp;
  }
}
