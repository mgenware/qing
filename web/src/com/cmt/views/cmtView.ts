/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import { ls } from 'ls';
import 'ui/editor/editBarApp';
import 'ui/status/statusOverlay';
import 'ui/buttons/linkButton';
import 'ui/widgets/svgIcon';
import 'com/like/likeApp';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Cmt } from '../data/cmt';
import { CHECK } from 'checks';
import { entityCmt } from 'sharedConstants';
import appPageState from 'app/appPageState';

@customElement('cmt-view')
export class CmtView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .highlighted {
          border-left: 4px solid var(--app-default-success-fore-color);
        }
      `,
    ];
  }

  @lp.object cmt: Cmt | null = null;
  // Only available to replies.
  @lp.string parentID: string | null = null;

  firstUpdated() {
    const { cmt } = this;
    CHECK(cmt);
  }

  render() {
    const { cmt } = this;
    CHECK(cmt);
    if (cmt.uiDeleted) {
      return html`<div class="p-md">${ls.cmtDeleted}</div>`;
    }
    return html`
      <div class=${`row ${cmt.uiHighlighted ? 'highlighted' : ''}`}>
        <div class="col-auto">
          <a href=${cmt.userURL}>
            <img
              src=${cmt.userIconURL}
              alt=${cmt.userName ?? ''}
              class="avatar-m"
              width="50"
              height="50" />
          </a>
        </div>
        <div class="col" style="padding-left: 0">
          <div>
            <a href=${cmt.userURL}>${cmt.userName}</a>
            <time-field
              class="m-l-sm"
              .createdAt=${cmt.createdAt}
              .modifiedAt=${cmt.modifiedAt}></time-field>
            ${cmt.userID === appPageState.userEID
              ? html`
                  <edit-bar-app
                    class="m-l-sm"
                    uid=${cmt.userID}
                    .hasLeftMargin=${true}
                    @editClick=${this.handleEditClick}
                    @deleteClick=${this.handleDeleteClick}></edit-bar-app>
                `
              : ''}
          </div>
          <div>${unsafeHTML(cmt.contentHTML)}</div>
          <div>
            <like-app
              .iconSize=${'sm'}
              .initialLikes=${cmt.likes || 0}
              .initialHasLiked=${!!cmt.hasLiked}
              .hostID=${cmt.id}
              .hostType=${entityCmt}></like-app>
            <link-button class="m-l-md" @click=${this.handleReplyClick}>${ls.reply}</link-button>
          </div>
        </div>
      </div>
    `;
  }

  private handleEditClick() {
    CHECK(this.cmt);
    this.dispatchEvent(new CustomEvent<Cmt>('editClick', { detail: this.cmt }));
  }

  private handleDeleteClick() {
    CHECK(this.cmt);
    this.dispatchEvent(new CustomEvent<Cmt>('deleteClick', { detail: this.cmt }));
  }

  private handleReplyClick(e: Event) {
    e.preventDefault();
    CHECK(this.cmt);
    this.dispatchEvent(new CustomEvent<Cmt>('replyClick', { detail: this.cmt }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-view': CmtView;
  }
}
