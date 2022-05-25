/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when, ref, createRef, Ref } from 'll';
import * as lp from 'lit-props';
import { ls, formatLS } from 'ls';
import './cmtBlock';
import { CmtBlock } from './cmtBlock';
import { CHECK } from 'checks';
import appPageState from 'app/appPageState';
import { parseString } from 'narwhal-js';
import Entity from 'lib/entity';

const brCmtCountCls = 'br-cmt-c';

@customElement('root-cmt-list')
// Displays root cmts in <cmt-block> and handles cases like no comments and login views.
export class RootCmtList extends BaseElement {
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

  // The number of all comments and their replies.
  @lp.number totalCmtCount = 0;
  @lp.object host!: Entity;

  private _cmtBlockEl: Ref<CmtBlock> = createRef();

  override firstUpdated() {
    CHECK(this.host);
  }

  override render() {
    const { totalCmtCount } = this;
    const titleEl = html`<h2>${ls.comments}</h2>
      ${when(!totalCmtCount, () => html`<p class=${brCmtCountCls}>${ls.noComments}</p>`)}`;
    const contentEl = html`
      <div class="m-t-md">
        ${when(
          this.totalCmtCount,
          () => html`<div>
            <small class=${`is-secondary ${brCmtCountCls}`}
              >${formatLS(ls.pNumOfComments, this.totalCmtCount)}</small
            >
          </div>`,
        )}
        <cmt-block ${ref(this._cmtBlockEl)} .loadOnVisible=${true} .host=${this.host}></cmt-block>
      </div>
    `;

    const addCmtGroup = appPageState.user
      ? this.renderCommentComposer()
      : this.renderLoginToComment();
    return html`${titleEl}${addCmtGroup}${contentEl}`;
  }

  private renderLoginToComment() {
    return html`
      <div>
        ${parseString(ls.plsLoginToComment).map((sg) => {
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

  private renderCommentComposer() {
    return html`
      <p>
        <qing-button btnStyle="success" @click=${this.handleAddCommentClick}
          >${ls.writeAComment}</qing-button
        >
      </p>
    `;
  }

  private handleAddCommentClick() {
    this._cmtBlockEl.value?.openCmtEditor({ editing: null, to: null });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'root-cmt-list': RootCmtList;
  }
}
