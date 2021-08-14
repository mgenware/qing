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
import ls, { formatLS } from 'ls';

const sizeMD = 'md';

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
  @lp.number initialLikes = 0;
  @lp.bool initialMyVote = VoteValue.clear;
  @lp.string iconSize = sizeMD;

  @lp.number private likes = 0;
  @lp.bool private isWorking = false;
  @lp.bool private myVote = VoteValue.clear;

  firstUpdated() {
    CHECK(this.hostID);

    this.likes = this.initialLikes ?? 0;
    this.myVote = this.initialMyVote;
  }

  render() {
    return html`
      <vote-view
        .isWorking=${this.isWorking}
        ..myVote=${this.initialMyVote}
        .likes=${this.likes}
        .iconSize=${this.iconSize === sizeMD ? 30 : 22}
        @click=${this.handleClick}
      ></vote-view>
    `;
  }

  private async handleClick() {
    if (this.isWorking) {
      return;
    }

    if (!appPageState.user) {
      await appAlert.warn(formatLS(ls.signInToLikeThisEntity, ls.post));
      return;
    }

    const loader = new VoteLoader(this.hostID, this.myVote);
    const res = await appTask.local(loader, (s) => (this.isWorking = s.isWorking));

    if (res.error) {
      await appAlert.error(res.error.message);
    } else {
      // TODO: handle vote change.
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vote-app': VoteApp;
  }
}
