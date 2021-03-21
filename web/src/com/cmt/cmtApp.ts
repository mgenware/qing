/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
// eslint-disable-next-line import/no-extraneous-dependencies
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import './views/rootCmtList';
import { CHECK } from 'checks';
import 'qing-overlay';
import 'ui/editor/composerView';
import Cmt from './data/cmt';
import { tif } from 'lib/htmlLib';
import { entityCmt, entityReply } from 'sharedConstants';
import ls, { formatLS } from 'ls';
import { ComposerContent, ComposerView } from 'ui/editor/composerView';
import { SetCmtLoader } from './loaders/setCmtLoader';
import app from 'app';
import { CmtDataHub, CmtEditorProps } from './data/cmtDataHub';

const composerID = 'composer';

@customElement('cmt-app')
export class CmtApp extends BaseElement {
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

  @lp.number initialTotalCmtCount = 0;
  @lp.string hostID = '';
  @lp.number hostType = 0;

  @lp.object editorProps = this.closedEditorProps();

  // The number of all comments and their replies.
  @lp.number private totalCmtCount = 0;

  private hub: CmtDataHub | null = null;

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);

    this.editorProps = this.closedEditorProps();
    const hub = new CmtDataHub(this.initialTotalCmtCount, this.hostID, this.hostType);
    hub.onOpenEditorRequested((req) => (this.editorProps = req));
    hub.onTotalCmtCountChanged((c) => (this.totalCmtCount += c));
    this.hub = hub;
  }

  private get composerEl(): ComposerView | null {
    return this.getShadowElement(composerID);
  }

  render() {
    const { editorProps } = this;
    const isReply = !!editorProps.parent;
    return html`
      <root-cmt-list
        .hub=${this.hub}
        .totalCmtCount=${this.totalCmtCount}
        .hostID=${this.hostID}
        .hostType=${this.hostType}
        .loadOnVisible=${!!this.initialTotalCmtCount}
      ></root-cmt-list>
      <qing-overlay class="immersive" ?open=${editorProps.open}>
        <h2>
          ${editorProps.replyingTo
            ? formatLS(ls.pReplyTo, editorProps.replyingTo.userName)
            : ls.writeAComment}
        </h2>
        ${tif(
          editorProps.replyingTo,
          html`<blockquote>${unsafeHTML(editorProps.replyingTo?.contentHTML)}</blockquote>`,
        )}
        <composer-view
          id=${composerID}
          .entityID=${editorProps.editing?.id ?? ''}
          .entityType=${isReply ? entityReply : entityCmt}
          .submitButtonText=${editorProps.editing ? ls.save : ls.comment}
          @onSubmit=${this.handleSubmit}
          @onDiscard=${this.handleDiscard}
        ></composer-view>
      </qing-overlay>
    `;
  }

  private handleDiscard() {
    this.closeEditor();
  }

  private closeEditor() {
    this.editorProps = this.closedEditorProps();
    this.composerEl?.resetEditor();
  }

  private async handleSubmit(e: CustomEvent<ComposerContent>) {
    const { editorProps, hub } = this;

    let loader: SetCmtLoader;
    if (!editorProps.editing) {
      if (editorProps.parent) {
        // Add a reply.
        loader = SetCmtLoader.newReply(
          this.hostID,
          this.hostType,
          // `toUserID`:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          editorProps.replyingTo!.userID,
          // `parentCmtID`:
          editorProps.parent.id,
          e.detail,
        );
      } else {
        // Add a comment.
        loader = SetCmtLoader.newCmt(this.hostID, this.hostType, e.detail);
      }
    } else {
      // Edit a comment or reply.
      loader = SetCmtLoader.editCmt(this.hostID, this.hostType, editorProps.editing.id, e.detail);
    }

    const status = await app.runGlobalActionAsync(loader, ls.publishing);
    if (status.data) {
      const serverCmt = status.data.cmt;
      this.closeEditor();

      if (!editorProps.editing) {
        if (editorProps.parent) {
          // Add a reply.
        } else {
          // Add a comment.
          hub?.addCmt(null, serverCmt);
        }
      } else {
        // Edit a comment or reply.

        // Copy all properties from the comment returned from server except for `createdAt`.
        // We're hot patching the cmt object, and the `createdAt` property
        // is something server must return (an empty timestamp) but doesn't
        // make sense here.
        const newCmt: Cmt = {
          ...editorProps.editing,
          ...serverCmt,
        };
        newCmt.createdAt = editorProps.editing.createdAt;
      }
    }
  }

  private closedEditorProps(): CmtEditorProps {
    return {
      open: false,
      editing: null,
      parent: null,
      replyingTo: null,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-app': CmtApp;
  }
}
