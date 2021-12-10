/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
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
    const hostID = postWind.id;
    return html`
      <like-app
        .iconSize=${'md'}
        .initialLikes=${postWind.initialLikes}
        .initialHasLiked=${!!postWind.initialHasLiked}
        .hostID=${hostID}
        .hostType=${entityPost}></like-app>
      <cmt-app
        .hostID=${hostID}
        .hostType=${entityPost}
        .initialTotalCmtCount=${postWind.cmtCount}></cmt-app>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-payload-app': PostPayloadApp;
  }
}
