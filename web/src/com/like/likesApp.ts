/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import { CHECK } from 'checks';
import './likesView';
import LikeHostType from './loaders/likeHostType';
import SetLikeLoader from './loaders/setLikeLoader';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';
import appPageState from 'app/appPageState';
import strf from 'bowhead-js';

const sizeMD = 'md';

@customElement('likes-app')
export class LikesApp extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }
      `,
    ];
  }

  @property() hostID = '';
  @property({ type: Number }) hostType: LikeHostType = 0;
  @property({ type: Number }) initialLikes = 0;
  @property({ type: Boolean }) initialHasLiked = false;
  @property() iconSize = sizeMD;

  @property({ type: Number }) private likes = 0;
  @property({ type: Boolean }) private isWorking = false;
  @property({ type: Boolean }) private hasLiked = false;

  override firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);

    this.likes = this.initialLikes || 0;
    this.hasLiked = this.initialHasLiked;
  }

  override render() {
    return html`
      <likes-view
        .isWorking=${this.isWorking}
        .hasLiked=${this.hasLiked}
        .likes=${this.likes}
        .iconSize=${this.iconSize === sizeMD ? 30 : 22}
        @likes-view-click=${this.handleClick}></likes-view>
    `;
  }

  private async handleClick() {
    if (this.isWorking) {
      return;
    }

    if (!appPageState.user) {
      await appAlert.warn(strf(globalThis.coreLS.signInToLikeThisEntity, globalThis.coreLS.post));
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
    'likes-app': LikesApp;
  }
}
