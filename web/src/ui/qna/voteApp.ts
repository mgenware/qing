/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import { CHECK } from 'checks';
import './voteView';
import { VoteLoader } from './loaders/voteLoader';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';
import appPageState from 'app/appPageState';
import { upVoteValue, downVoteValue, noVoteValue } from 'sharedConstants';
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
  @lp.number initialValue = 0;
  @lp.number initialUps = 0;
  @lp.number initialDowns = 0;
  @lp.number initialMyVote = 0;

  @lp.bool private isWorking = false;
  @lp.number private value = 0;
  @lp.number private ups = 0;
  @lp.number private downs = 0;
  @lp.number private myVote = 0;

  firstUpdated() {
    CHECK(this.hostID);
    this.value = this.initialValue;
    this.ups = this.initialUps;
    this.downs = this.initialDowns;
    this.myVote = this.initialMyVote;
  }

  render() {
    return html`
      <div class=${this.isWorking ? 'content-disabled' : ''}>
        <vote-view
          .value=${this.value}
          .ups=${this.ups}
          .downs=${this.downs}
          .myVote=${this.myVote}
          @upVoteClick=${() => this.doVote(upVoteValue)}
          @downVoteClick=${() => this.doVote(downVoteValue)}
        ></vote-view>
      </div>
    `;
  }

  private async doVote(voteButton: number) {
    if (this.isWorking) {
      return;
    }

    if (!appPageState.user) {
      await appAlert.warn(ls.signInToVoteThisAnswer);
      return;
    }

    let nextVoteValue: number;
    let isRetractingVote = false;
    if (voteButton === this.myVote) {
      // The user is retracting the vote.
      nextVoteValue = noVoteValue;
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
      // Retracting a vote.
      if (nextVoteValue === upVoteValue) {
        this.updateDowns(1);
      } else if (nextVoteValue === downVoteValue) {
        this.updateDowns(1);
      }
      this.myVote = noVoteValue;
    } else {
      if (this.myVote === noVoteValue) {
        // New vote.
        if (nextVoteValue === upVoteValue) {
          this.updateUps(1);
        } else if (nextVoteValue === downVoteValue) {
          this.updateDowns(1);
        }
      } else {
        // Switch votes.
        // eslint-disable-next-line no-lonely-if
        if (nextVoteValue === upVoteValue) {
          this.updateUps(1);
          this.updateDowns(-1);
        } else if (nextVoteValue === downVoteValue) {
          this.updateDowns(1);
          this.updateUps(-1);
        }
      }
      this.myVote = voteButton;
    }
  }

  private updateDowns(offset: number) {
    this.downs += offset;
    this.value += -offset;
  }

  private updateUps(offset: number) {
    this.ups += offset;
    this.value += offset;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vote-app': VoteApp;
  }
}
