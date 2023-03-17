/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property } from 'll.js';
// NOTE: `edit-bar-app` is required as it's being used by post page template.
import 'ui/editing/editBarApp';
import 'com/postCore/setEntityApp';
import { CHECK } from 'checks.js';

@customElement('post-user-app')
export class PostUserApp extends BaseElement {
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

  @property() createdAt = '';
  @property() modifiedAt = '';
  @property() uid = '';
  @property() eid = '';
  @property({ type: Number }) entityType = 0;

  // Optional properties (can be overridden by named slots).
  @property() userIconURL = '';
  @property() userURL = '';
  @property() userName = '';

  override render() {
    const imgSlot =
      this.userURL && this.userIconURL
        ? html`<a href="{{html .UserURL}}" slot="img">
            <img
              src=${this.userIconURL}
              alt=${this.userName}
              class="avatar-m"
              width="50"
              height="50" />
          </a>`
        : html`<slot name="img"></slot>`;
    const nameSlot = this.userName
      ? html`<a href="{{html .UserURL}}" slot="name">${this.userName}</a>`
      : html`<slot name="name"></slot>`;
    return html`
      <div class="avatar-grid">
        <div>${imgSlot}</div>
        <div>
          <div>${nameSlot}</div>
          <div class="m-t-sm">
            <time-field .createdAt=${this.createdAt} .modifiedAt=${this.modifiedAt}></time-field>
            <span class="m-l-md">
              <slot name="toolbar"></slot>
            </span>
          </div>
        </div>
      </div>
    `;
  }

  override firstUpdated() {
    CHECK(this.eid);
    CHECK(this.entityType);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-user-app': PostUserApp;
  }
}
