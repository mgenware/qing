/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import { ls, formatLS } from 'ls';
import 'ui/editor/editBarApp';
import 'ui/status/statusOverlay';
import 'ui/buttons/linkButton';
import 'ui/widgets/svgIcon';
import 'com/like/likeApp';
import { unsafeHTML } from 'lit/directives/unsafe-html';
import { staticMainImage } from 'urls';
import Cmt, { isCmtReply } from '../data/cmt';
import { CHECK } from 'checks';
import { entityCmt, entityReply } from 'sharedConstants';
import appPageState from 'app/appPageState';
import { editBarID } from 'ui/editor/editBarApp';

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
  @lp.string parentCmtID: string | null = null;

  firstUpdated() {
    const { cmt } = this;
    CHECK(cmt);
  }

  render() {
    const { cmt } = this;
    CHECK(cmt);
    const isReply = isCmtReply(cmt);
    return html`
      <div class=${`row ${cmt.uiHighlighted ? 'highlighted' : ''}`}>
        <div class="col-auto">
          <a href=${cmt.userURL}>
            <img src=${cmt.userIconURL} class="avatar-m" width="50" height="50" />
          </a>
        </div>
        <div class="col" style="padding-left: 0">
          <div>
            <a href=${cmt.userURL}>${cmt.userName}</a>
            ${cmt.toUserID
              ? html`
                  <span>
                    <svg-icon
                      title=${formatLS(ls.pReplyTo, cmt.toUserName)}
                      iconStyle="info"
                      .oneTimeSrc=${staticMainImage('reply-to.svg')}
                      .size=${16}
                    >
                    </svg-icon>
                    <a href=${cmt.toUserURL || '#'}>${cmt.toUserName}</a>
                  </span>
                `
              : ''}
            <time-field .createdAt=${cmt.createdAt} .modifiedAt=${cmt.modifiedAt}></time-field>
            ${cmt.userID === appPageState.userEID
              ? html`
                  <edit-bar-app
                    class="m-l-md"
                    id=${editBarID(entityCmt, cmt.id)}
                    uid=${cmt.userID}
                    .hasLeftMargin=${true}
                    @editClick=${this.handleEditClick}
                    @deleteClick=${this.handleDeleteClick}
                  ></edit-bar-app>
                `
              : ''}
          </div>
          <div>${unsafeHTML(cmt.contentHTML)}</div>
          <div>
            <qing-button
              class="icon no-left-padding"
              title=${ls.reply}
              disableSelectedStyle
              @click=${this.handleReplyClick}
              ><svg-icon .oneTimeSrc=${staticMainImage('add-cmt.svg')} size="22"></svg-icon>
            </qing-button>
            <like-app
              .iconSize=${'sm'}
              .initialLikes=${cmt.likes}
              .initialHasLiked=${!!cmt.hasLiked}
              .hostID=${cmt.id}
              .hostType=${isReply ? entityReply : entityCmt}
            ></like-app>
          </div>
        </div>
      </div>
    `;
  }

  private handleEditClick() {
    CHECK(this.cmt);
    this.dispatchEvent(
      new CustomEvent<Cmt>('editClick', { detail: this.cmt }),
    );
  }

  private handleDeleteClick() {
    CHECK(this.cmt);
    this.dispatchEvent(
      new CustomEvent<Cmt>('deleteClick', { detail: this.cmt }),
    );
  }

  private async handleReplyClick() {
    CHECK(this.cmt);
    this.dispatchEvent(
      new CustomEvent<Cmt>('replyClick', { detail: this.cmt }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-view': CmtView;
  }
}
