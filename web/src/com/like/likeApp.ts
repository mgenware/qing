/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import { CHECK } from 'checks';
import './likeView';
import LikeHostType from './loaders/likeHostType';
import SetLikeLoader from './loaders/setLikeLoader';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';

const sizeMD = 'md';

@customElement('like-app')
export class LikeApp extends BaseElement {
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
  // Reflected: used for quick locating the view during testing.
  @lp.reflected.number hostType: LikeHostType = 0;
  @lp.number initialLikes = 0;
  @lp.bool initialHasLiked = false;
  @lp.string iconSize = sizeMD;

  @lp.number private likes = 0;
  @lp.bool private isWorking = false;
  @lp.bool private hasLiked = false;

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);

    this.likes = this.initialLikes ?? 0;
    this.hasLiked = this.initialHasLiked;
  }

  render() {
    return html`
      <like-view
        .isWorking=${this.isWorking}
        .hasLiked=${this.hasLiked}
        .likes=${this.likes}
        .iconSize=${this.iconSize === sizeMD ? 30 : 22}
        @click=${this.handleClick}
      ></like-view>
    `;
  }

  private async handleClick() {
    if (this.isWorking) {
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
