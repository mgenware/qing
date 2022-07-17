/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll';
import { CHECK } from 'checks';
import './likeView';
import LikeHostType from './loaders/likeHostType';
import SetLikeLoader from './loaders/setLikeLoader';
import appTask from 'app/appTask';
import appAlert from 'app/appAlert';
import appPageState from 'app/appPageState';
import ls, { formatLS } from 'ls';

const sizeMD = 'md';

@customElement('like-app')
export class LikeApp extends BaseElement {
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

  // Reflected: used for quick locating the view during testing.
  @property({ reflect: true }) hostID = '';
  // Reflected: used for quick locating the view during testing.
  @property({ type: Number, reflect: true }) hostType: LikeHostType = 0;
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
