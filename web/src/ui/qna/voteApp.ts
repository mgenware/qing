/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import { CHECK } from 'checks';
import './likeView';
import { VoteLoader, VoteValue } from './loaders/voteLoader';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';
import appPageState from 'app/appPageState';
import ls from 'ls';

@customElement('vote-app')
export class VoteApp extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }
      `,
    ];
  }

  // Reflected: used for quick locating the view during testing.
  @lp.reflected.string hostID = '';

  @lp.bool private isWorking = false;
  @lp.reflected.number value = 0;
  @lp.reflected.number ups = 0;
  @lp.reflected.number downs = 0;
  @lp.reflected.number myVote: VoteValue = 0;

  firstUpdated() {
    CHECK(this.hostID);
  }

  render() {
    return html`
      <div class=${this.isWorking ? 'content-disabled' : ''}>
        <vote-view
          .value=${this.value}
          .ups=${this.ups}
          .downs=${this.downs}
          .myVote=${this.myVote}
          @upVoteClick=${() => this.doVote(VoteValue.up)}
          @downVoteClick=${() => this.doVote(VoteValue.down)}
        ></vote-view>
      </div>
    `;
  }

  private async doVote(voteButton: VoteValue) {
    if (this.isWorking) {
      return;
    }

    if (!appPageState.user) {
      await appAlert.warn(ls.signInToVoteThisAnswer);
      return;
    }

    let nextVoteValue: VoteValue;
    let isRetractingVote = false;
    if (voteButton === this.myVote) {
      // The user is retracting the vote.
      nextVoteValue = VoteValue.clear;
      isRetractingVote = true;
    } else {
      nextVoteValue = voteButton;
    }

    const loader = new VoteLoader(this.hostID, nextVoteValue);
    const res = await appTask.local(loader, (s) => (this.isWorking = s.isWorking));

    if (res.error) {
      await appAlert.error(res.error.message);
      return;
    }
    if (isRetractingVote) {
      this.myVote = VoteValue.clear;
    } else {
      this.myVote = voteButton;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vote-app': VoteApp;
  }
}
