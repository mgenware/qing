/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css } from 'll';
import BaseElement from 'baseElement';
import 'com/cmt/cmtApp';
import postWind from './postWind';
import 'com/like/likeApp';
import { entityPost } from 'sharedConstants';

// Handles loading of post likes and comments.
@customElement('post-payload-app')
export class PostPayloadApp extends BaseElement {
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

  render() {
    const hostID = postWind.EID;
    const cmtCount = postWind.CmtCount;
    const initialLikes = postWind.InitialLikes;
    const initialHasLiked = postWind.InitialHasLiked;

    return html`
      <like-app
        .iconSize=${'md'}
        .initialLikes=${initialLikes}
        .initialHasLiked=${initialHasLiked}
        .hostID=${hostID}
        .hostType=${entityPost}
      ></like-app>
      <cmt-app
        .hostID=${hostID}
        .hostType=${entityPost}
        .initialTotalCmtCount=${cmtCount}
      ></cmt-app>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-payload-app': PostPayloadApp;
  }
}
