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
import { appdef } from '@qing/def';

// Handles loading of post likes and comments.
@customElement('post-payload-app')
export class PostPayloadApp extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  override render() {
    const hostID = postWind.id;
    return html`
      <like-app
        .iconSize=${'md'}
        .initialLikes=${postWind.initialLikes ?? 0}
        .initialHasLiked=${!!postWind.initialHasLiked}
        .hostID=${hostID}
        .hostType=${appdef.contentBaseTypePost}></like-app>
      <cmt-app
        .host=${{ id: hostID, type: appdef.contentBaseTypePost }}
        .initialTotalCmtCount=${postWind.cmtCount ?? 0}></cmt-app>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-payload-app': PostPayloadApp;
  }
}
