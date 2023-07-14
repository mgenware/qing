/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, state } from 'll.js';
import 'com/cmt/cmtApp';
import postPageState from './postPageState.js';
import 'com/like/likesApp.js';
import { frozenDef } from '@qing/def';
import * as pu from 'lib/pageUtil.js';
import 'com/share/sharePopup.js';
import * as urls from 'urls.js';
import appAlert from 'app/appAlert.js';

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
    const hostID = postPageState.id;
    const contentType = postPageState.isThread
      ? frozenDef.ContentBaseType.fPost
      : frozenDef.ContentBaseType.post;
    return html`
      <div>
        <likes-app
          .iconSize=${'md'}
          .initialLikes=${postPageState.initialLikes ?? 0}
          .initialHasLiked=${!!postPageState.initialHasLiked}
          .hostID=${hostID}
          .hostType=${contentType}></likes-app>
        <link-button class="m-l-md" @click=${this.handleShareClick}
          >${globalThis.coreLS.share}</link-button
        >
      </div>
      <cmt-app
        .host=${{ id: hostID, type: contentType }}
        .initialTotalCmtCount=${postPageState.cmtCount ?? 0}
        .focusModeData=${postPageState.focusMode}
        @cmt-app-view-all-cmts=${this.handleViewAllCmts}></cmt-app>
    `;
  }

  private handleViewAllCmts() {
    // Remove the focus mode param in URL.
    const url = new URL(window.location.href);
    url.searchParams.delete('cmt');
    pu.jumpToURL(url.toString());
  }

  private handleShareClick() {
    appAlert.showSharePopup(urls.post(postPageState.id));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-payload-app': PostPayloadApp;
  }
}
