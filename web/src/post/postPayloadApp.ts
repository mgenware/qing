/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import 'com/cmt/cmtApp';
import postWind from './postWind';
import 'com/like/likeApp';
import { entityPost } from 'sharedConstants';

// Handles loading of post likes and comments.
@ll.customElement('post-payload-app')
export class PostPayloadApp extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
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

    return ll.html`
      <like-app
        .iconSize=${'md'}
        .initialLikes=${initialLikes}
        .initialHasLiked=${initialHasLiked}
        .hostID=${hostID}
        .hostType=${entityPost}></like-app>
      <cmt-app
        .hostID=${hostID}
        .hostType=${entityPost}
        .initialTotalCmtCount=${cmtCount}></cmt-app>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-payload-app': PostPayloadApp;
  }
}
