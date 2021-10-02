/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import { CHECK } from 'checks';
import './likeView';
import LikeHostType from './loaders/likeHostType';
import SetLikeLoader from './loaders/setLikeLoader';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';
import appPageState from 'app/appPageState';
import ls, { formatLS } from 'ls';

const sizeMD = 'md';

@ll.customElement('like-app')
export class LikeApp extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: inline-block;
        }
      `,
    ];
  }

  // Reflected: used for quick locating the view during testing.
  @ll.reflected.string hostID = '';
  // Reflected: used for quick locating the view during testing.
  @ll.reflected.number hostType: LikeHostType = 0;
  @ll.number initialLikes = 0;
  @ll.bool initialHasLiked = false;
  @ll.string iconSize = sizeMD;

  @ll.number private likes = 0;
  @ll.bool private isWorking = false;
  @ll.bool private hasLiked = false;

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);

    this.likes = this.initialLikes ?? 0;
    this.hasLiked = this.initialHasLiked;
  }

  render() {
    return ll.html`
      <like-view
        .isWorking=${this.isWorking}
        .hasLiked=${this.hasLiked}
        .likes=${this.likes}
        .iconSize=${this.iconSize === sizeMD ? 30 : 22}
        @click=${this.handleClick}></like-view>
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

    const loader = new SetLikeLoader(this.hostID, this.hostType, !this.hasLiked);
    const res = await appTask.local(loader, (s) => (this.isWorking = s.isWorking));

    if (res.error) {
      await appAlert.error(res.error.message);
    } else {
      this.hasLiked = !this.hasLiked;
      this.likes += this.hasLiked ? 1 : -1;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'like-app': LikeApp;
  }
}
