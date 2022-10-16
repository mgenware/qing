/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when, property, state, classMap } from 'll';
import { ls, formatLS } from 'ls';
import './cmtBlock';
import { CmtBlock } from './cmtBlock';
import { CHECK } from 'checks';
import appPageState from 'app/appPageState';
import { parseString } from 'narwhal-js';
import Entity from 'lib/entity';
import 'ui/editing/composerView';
import { SetCmtLoader } from '../loaders/setCmtLoader';
import { ComposerView } from 'ui/editing/composerView';
import appTask from 'app/appTask';
import { Cmt } from '../data/cmt';
import { CmtFocusModeData } from 'sod/cmt';
import { listenForVisibilityChange } from 'lib/htmlLib';

const brCmtCountCls = 'br-cmt-c';
const rootEditorID = 'root-editor';
const cmtBlockID = 'cmt-block';

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

        /** Used on buttons between cmts */
        .btn-in-cmts {
          margin-top: 1rem;
          margin-bottom: 1.4rem;
        }

        .focus-mode {
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid var(--app-default-separator-color);
        }
      `,
    ];
  }

  // The number of all comments and their replies.
  @property({ type: Number }) totalCmtCount = 0;
  @property({ type: Object }) host!: Entity;

  // In initial focus mode, we can have 1 or 2 cmts.
  // Those props are set in <cmt-app> and processed in `firstRender`.
  @property({ type: Object }) focusModeData?: CmtFocusModeData;

  @state() _rootEditorOpen = false;

  _unregisterVisibility?: () => void;

  private get rootEditorEl() {
    return this.getShadowElement<ComposerView>(rootEditorID);
  }

  private get cmtBlockEl() {
    return this.getShadowElement<CmtBlock>(cmtBlockID);
  }

  override firstUpdated() {
    CHECK(this.host);
  }

  override render() {
    const { totalCmtCount } = this;
    const titleEl = html`<h2>${ls.comments}</h2>
      ${when(!totalCmtCount, () => html`<p class=${brCmtCountCls}>${ls.noComments}</p>`)}`;
    const contentEl = html`
      <div
        class=${classMap({
          'm-t-md': true,
          'focus-mode': !!this.focusModeData,
        })}>
        ${when(
          this.totalCmtCount,
          () => html`<div>
            <small class=${`is-secondary ${brCmtCountCls}`}
              >${formatLS(ls.pNumOfComments, this.totalCmtCount)}</small
            >
          </div>`,
        )}
        ${when(
          this.focusModeData,
          () => html` <div class="btn-in-cmts">
            <link-button @click=${this.viewAllCmts}>${ls.viewAllCmts}</link-button>
          </div>`,
        )}
        ${this.focusModeData?.is404 ? this.renderCmtNotFound() : this.renderMainContent()}
      </div>
    `;

    const addCmtGroup = appPageState.user
      ? this.renderCommentButton()
      : this.renderLoginToComment();
    return html`${titleEl}${addCmtGroup}${contentEl}${when(
      this._rootEditorOpen,
      () => html`<qing-overlay class="immersive" open>
        <composer-view
          id=${rootEditorID}
          .desc=${ls.writeAComment}
          .submitButtonText=${ls.send}
          @composer-submit=${this.handleRootEditorSubmit}
          @composer-discard=${this.handleRootEditorDiscard}></composer-view>
      </qing-overlay>`,
    )}`;
  }

  private renderCmtNotFound() {
    return html`<p>${ls.cmtNotFound}</p>`;
  }

  private renderMainContent() {
    let assignedCmt: Cmt | undefined;
    let assignedChildCmt: Cmt | undefined;
    const { focusModeData } = this;
    if (focusModeData) {
      if (focusModeData.parentCmt) {
        assignedCmt = focusModeData.parentCmt;
        assignedChildCmt = focusModeData.cmt;
      } else {
        assignedCmt = focusModeData.cmt;
      }
    }
    return html`<cmt-block
      id=${cmtBlockID}
      .loadOnVisible=${!this.focusModeData}
      .host=${this.host}
      .cmt=${assignedCmt}
      .initialAssignedChild=${assignedChildCmt}></cmt-block>`;
  }

  override connectedCallback() {
    super.connectedCallback();

    if (!this.focusModeData) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._unregisterVisibility = listenForVisibilityChange(this, () =>
        this.cmtBlockEl?.loadMore(),
      );
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    this._unregisterVisibility?.();
  }

  private async handleRootEditorSubmit() {
    if (!this.rootEditorEl || !this.cmtBlockEl) {
      return;
    }
    const loader = SetCmtLoader.newCmt(this.host, {
      contentHTML: this.rootEditorEl.contentHTML ?? '',
    });
    const apiRes = await appTask.critical(loader, ls.publishing);
    if (apiRes.data) {
      this.destroyEditor();
      const newCmt = apiRes.data.cmt;
      this.cmtBlockEl.addRootCmt(newCmt);
    }
  }

  private handleRootEditorDiscard() {
    this.destroyEditor();
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

  private renderCommentButton() {
    return html`
      <p>
        <qing-button btnStyle="success" @click=${this.handleAddCommentClick}
          >${ls.writeAComment}</qing-button
        >
      </p>
    `;
  }

  private handleAddCommentClick() {
    this._rootEditorOpen = true;
  }

  private destroyEditor() {
    this.rootEditorEl?.markAsSaved();
    this._rootEditorOpen = false;
  }

  private viewAllCmts() {
    this.dispatchEvent(new CustomEvent('rcl-view-all-cmts'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'root-cmt-list': RootCmtList;
  }
}
