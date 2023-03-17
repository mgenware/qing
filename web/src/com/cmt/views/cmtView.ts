/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
import 'ui/editing/editBarApp';
import 'ui/status/statusOverlay';
import 'ui/buttons/linkButton.js';
import 'ui/widgets/svgIcon';
import 'com/like/likesApp.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Cmt } from '../data/cmt.js';
import { CHECK } from 'checks.js';
import { appdef } from '@qing/def';
import appPageState from 'app/appPageState.js';

@customElement('cmt-view')
export class CmtView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          padding-right: 0.5rem;
        }

        .highlighted {
          background-color: var(--app-highlight-color);
          box-shadow: 0 0 0 100vmax var(--app-highlight-color);
          clip-path: inset(0 -100vmax);
        }
      `,
    ];
  }

  @property({ type: Object }) cmt?: Cmt;
  // Only available to replies.
  @property() parentID?: string;

  override firstUpdated() {
    const { cmt } = this;
    CHECK(cmt);
  }

  override render() {
    const { cmt } = this;
    return html`<div class=${`root ${cmt?.uiHighlighted ? 'highlighted' : ''}`}>
      ${this.renderContent()}
    </div>`;
  }

  private renderContent() {
    const { cmt } = this;
    CHECK(cmt);
    if (!cmt.userID) {
      return html`<div class="p-md">${globalThis.coreLS.cmtDeleted}</div>`;
    }
    return html`
      <div class="avatar-grid">
        <div>
          <a href=${cmt.userURL}>
            <img
              src=${cmt.userIconURL}
              alt=${cmt.userName ?? ''}
              class="avatar-m"
              width="50"
              height="50" />
          </a>
        </div>
        <div>
          <div>
            <a href=${cmt.userURL}>${cmt.userName}</a>
            <time-field
              class="m-l-md"
              .createdAt=${cmt.createdAt}
              .modifiedAt=${cmt.modifiedAt}></time-field>
            <link-button class="m-l-md" @click=${this.handleShareClick}
              >${globalThis.coreLS.share}</link-button
            >
            ${cmt.userID === appPageState.userID
              ? html`
                  <edit-bar-app
                    class="m-l-md"
                    uid=${cmt.userID}
                    .hasLeftMargin=${true}
                    @edit-bar-edit-click=${this.handleEditClick}
                    @edit-bar-delete-click=${this.handleDeleteClick}></edit-bar-app>
                `
              : ''}
          </div>
          <div class="md-content">${unsafeHTML(cmt.contentHTML || '')}</div>
          <div>
            <link-button @click=${this.handleReplyClick}>${globalThis.coreLS.reply}</link-button>
            <likes-app
              class="m-l-md"
              .iconSize=${'sm'}
              .initialLikes=${cmt.likes || 0}
              .initialHasLiked=${!!cmt.isLiked}
              .hostID=${cmt.id}
              .hostType=${appdef.ContentBaseType.cmt}></likes-app>
          </div>
        </div>
      </div>
    `;
  }

  private handleEditClick() {
    CHECK(this.cmt);
    this.dispatchEvent(new CustomEvent<Cmt>('cmt-view-edit-click', { detail: this.cmt }));
  }

  private handleDeleteClick() {
    CHECK(this.cmt);
    this.dispatchEvent(new CustomEvent<Cmt>('cmt-view-delete-click', { detail: this.cmt }));
  }

  private handleShareClick() {
    CHECK(this.cmt);
    this.dispatchEvent(new CustomEvent<Cmt>('cmt-view-share-click', { detail: this.cmt }));
  }

  private handleReplyClick(e: Event) {
    e.preventDefault();
    CHECK(this.cmt);
    this.dispatchEvent(new CustomEvent<Cmt>('cmt-view-reply-click', { detail: this.cmt }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-view': CmtView;
  }
}
