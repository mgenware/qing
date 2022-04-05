/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import ls from 'ls';
import { parseString } from 'narwhal-js';
import appPageState from 'app/appPageState';
import { appdef } from '@qing/def';
import 'com/postCore/setEntityApp';
import wind from './qnaWind';

@customElement('add-rep;y-app')
export class AddReplyApp extends BaseElement {
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

  @lp.string myReplyURL = '';
  @lp.bool isMyReply = false;
  @lp.bool replyDialogOpen = false;

  render() {
    // Render "login to reply" for visitors.
    if (!appPageState.user) {
      return this.renderLoginToAddYourReply();
    }

    // Render nothing if current page is my reply.
    if (this.isMyReply) {
      return '';
    }

    // Render "go to my reply" button if `myReplyURL` is not empty.
    if (this.myReplyURL) {
      return html`<qing-button btnStyle="primary">${ls.goToMyReply}</qing-button>`;
    }

    // Render "post an reply".
    return html`<qing-button btnStyle="success" @click=${this.handlePostAnReplyClick}
        >${ls.postAReply}</qing-button
      >
      <set-entity-app
        ?open=${this.replyDialogOpen}
        .showTitleInput=${false}
        entityType=${appdef.ContentBaseType.threadMsg}
        headerText=${ls.postAReply}
        .forumID=${wind.forumID || ''}
        .questionID=${wind.questionID}
        @onEditorClose=${this.handleReplyDialogClose}></set-entity-app>`;
  }

  private renderLoginToAddYourReply() {
    return html`
      <div>
        ${parseString(ls.postAReply).map((sg) => {
          if (!sg.type) {
            return html`<span>${sg.value}</span>`;
          }
          return html`<qing-button btnStyle="success" class="m-l-xs m-r-xs"
            >${sg.value}</qing-button
          >`;
        })}
      </div>
    `;
  }

  private handlePostAnReplyClick() {
    this.replyDialogOpen = true;
  }

  private handleReplyDialogClose() {
    this.replyDialogOpen = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-reply-app': AddReplyApp;
  }
}
