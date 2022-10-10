/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, state } from 'll';
import 'com/cmt/cmtApp';
import postWind from './postWind';
import ls from 'ls';
import 'com/like/likesApp';
import { appdef } from '@qing/def';
import * as pu from 'lib/pageUtil';
import 'com/share/sharePopup';
import * as urls from 'urls';

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

  @state() _sharePopupOpen = false;

  override render() {
    const hostID = postWind.id;
    const contentType = postWind.isThread
      ? appdef.contentBaseTypeThread
      : appdef.contentBaseTypePost;
    return html`
      <div>
        <likes-app
          .iconSize=${'md'}
          .initialLikes=${postWind.initialLikes ?? 0}
          .initialHasLiked=${!!postWind.initialHasLiked}
          .hostID=${hostID}
          .hostType=${contentType}></likes-app>
        <link-button class="m-l-md" @click=${() => (this._sharePopupOpen = true)}
          >${ls.share}</link-button
        >
        <share-popup
          .open=${this._sharePopupOpen}
          .link=${urls.post(postWind.id)}
          @share-popup-close=${() => (this._sharePopupOpen = false)}></share-popup>
      </div>
      <cmt-app
        .host=${{ id: hostID, type: contentType }}
        .initialTotalCmtCount=${postWind.cmtCount ?? 0}
        .focusedCmt404=${!!postWind.focusedCmt404}
        .initialFocusedCmt=${postWind.focusedCmt}
        .initialFocusedCmtParent=${postWind.focusedCmtParent}
        @cmt-app-view-all-cmts=${this.handleViewAllCmts}></cmt-app>
    `;
  }

  private handleViewAllCmts() {
    // Remove the focus mode param in URL.
    const url = new URL(window.location.href);
    url.searchParams.delete('cmt');
    pu.jumpToURL(url.toString());
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-payload-app': PostPayloadApp;
  }
}
