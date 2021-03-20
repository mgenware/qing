import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import app from 'app';
import { ls, formatLS } from 'ls';
import BaseElement from 'baseElement';
import 'ui/editor/editBar';
import 'ui/status/statusOverlay';
import 'ui/buttons/linkButton';
import 'ui/widgets/svgIcon';
import 'com/like/likeApp';
// eslint-disable-next-line import/no-extraneous-dependencies
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { staticMainImage } from 'urls';
import Cmt, { isCmtReply } from '../data/cmt';
import { CHECK } from 'checks';
import { entityCmt, entityReply } from 'sharedConstants';
@customElement('cmt-view')
export class CmtView extends BaseElement {
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

  @lp.object cmt?: Cmt;
  // Only available to replies.
  @lp.string parentCmtID?: string;

  firstUpdated() {
    CHECK(this.cmt);
  }

  render() {
    const { cmt } = this;
    CHECK(cmt);
    const isReply = isCmtReply(cmt);
    return html`
      <div class="m-t-md row">
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
            ${cmt.userID === app.state.userEID
              ? html`
                  <edit-bar
                    .hasLeftMargin=${true}
                    @editClick=${this.handleEditClick}
                    @deleteClick=${this.handleDeleteClick}
                  ></edit-bar>
                  <link-button class="m-l-sm" @click=${this.handleReplyClick}
                    >${ls.reply}</link-button
                  >
                `
              : ''}
          </div>
          <div>${unsafeHTML(cmt.contentHTML)}</div>
          <p>
            <like-app
              .iconSize=${'sm'}
              .initialLikes=${cmt.likes}
              .hostID=${cmt.id}
              .hostType=${isReply ? entityReply : entityCmt}
            ></like-app>
          </p>
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
