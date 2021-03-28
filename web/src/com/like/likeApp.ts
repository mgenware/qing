/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import { listenForVisibilityChange } from 'lib/htmlLib';
import { CHECK } from 'checks';
import './likeView';
import LikeHostType from './loaders/likeHostType';
import GetLikeLoader from './loaders/getLikeLoader';
import SetLikeLoader from './loaders/setLikeLoader';
import appPageState from 'app/appPageState';
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

  @lp.string hostID = '';
  @lp.string hostType: LikeHostType = 0;
  @lp.number initialLikes = 0;
  @lp.string iconSize = sizeMD;

  @lp.number private likes = 0;
  @lp.bool private isWorking = false;
  @lp.bool private hasLiked = false;

  // Starts `get-like` API when the component is first visible.
  @lp.bool loadOnVisible = false;

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);

    this.likes = this.initialLikes ?? 0;
    if (appPageState.user) {
      if (this.loadOnVisible) {
        listenForVisibilityChange([this], () => this.loadHasLiked);
      } else {
        this.loadHasLiked();
      }
    }
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

  private async loadHasLiked() {
    const loader = new GetLikeLoader(this.hostID, this.hostType);
    const res = await appTask.local(loader, (s) => (this.isWorking = s.isWorking));
    if (res.error) {
      await appAlert.error(res.error.message);
    } else {
      this.hasLiked = res.data || false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'like-app': LikeApp;
  }
}
