/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
// NOTE: `edit-bar-app` is required as it's being used by post page template.
import 'ui/editor/editBarApp';
import 'com/postCore/setEntityApp';
import { CHECK } from 'checks';

@customElement('post-user-app')
export class PostUserApp extends BaseElement {
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

  @lp.string createdAt = '';
  @lp.string modifiedAt = '';
  @lp.string uid = '';
  @lp.string eid = '';
  @lp.number entityType = 0;

  // Optional properties (can be overridden by named slots).
  @lp.string userIconURL = '';
  @lp.string userURL = '';
  @lp.string userStatus = '';
  @lp.string userName = '';

  render() {
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
    const statusSlot = this.userStatus
      ? html`<span slot="status">${this.userStatus}</span>`
      : html`<slot name="status"></slot>`;
    return html`
      <div class="m-t-md row m-user-view">
        <div class="col-auto">${imgSlot}</div>
        <div class="col">
          <div>${nameSlot}<span class="m-l-md"> ${statusSlot}</span></div>
          <div class="m-t-md">
            <time-field .createdAt=${this.createdAt} .modifiedAt=${this.modifiedAt}></time-field>
            <span class="m-l-md">
              <slot name="toolbar"></slot>
            </span>
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    CHECK(this.eid);
    CHECK(this.entityType);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-user-app': PostUserApp;
  }
}
