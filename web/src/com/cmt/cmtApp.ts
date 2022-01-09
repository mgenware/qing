/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import './views/rootCmtList';
import { CHECK } from 'checks';
import 'qing-overlay';
import 'ui/editor/composerView';
import { Cmt, isCmtReply } from './data/cmt';
import { tif } from 'lib/htmlLib';
import { entityCmt, entityReply } from 'sharedConstants';
import ls, { formatLS } from 'ls';
import { ComposerContent, ComposerView } from 'ui/editor/composerView';
import { SetCmtLoader } from './loaders/setCmtLoader';
import { CmtDataHub, CmtEditorProps } from './data/cmtDataHub';
import DeleteCmtLoader from './loaders/deleteCmtLoader';
import appTask from 'app/appTask';
import appCmtHubState from './data/appCmtHubState';

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

    this.totalCmtCount = this.initialTotalCmtCount;
    this.editorProps = this.closedEditorProps();
    const hub = new CmtDataHub(this.hostID, this.hostType);
    hub.openEditorRequested.on((req) => (this.editorProps = req));
    hub.totalCmtCountChangedWithOffset.on((offset) => (this.totalCmtCount += offset));
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    hub.deleteCmtRequested.on(async (e) => this.handleDeleteCmt(e));
    appCmtHubState.setHub(this.hostType, this.hostID, hub);
    this.hub = hub;
  }

  private get composerEl(): ComposerView | null {
    return this.getShadowElement(composerID);
  }

  render() {
    const { editorProps } = this;
    const isReply = !!editorProps.parent;

    let heading: string;
    if (editorProps.replyingTo) {
      heading = formatLS(ls.pReplyTo, editorProps.replyingTo.userName);
    } else if (editorProps.editing) {
      heading = ls.editComment;
    } else {
      heading = ls.writeAComment;
    }

    return html`
      <root-cmt-list
        .totalCmtCount=${this.totalCmtCount}
        .hostID=${this.hostID}
        .hostType=${this.hostType}
        .loadOnVisible=${!!this.initialTotalCmtCount}></root-cmt-list>
      <qing-overlay class="immersive" ?open=${editorProps.open}>
        <h2>${heading}</h2>
        ${tif(
          editorProps.replyingTo,
          html`<blockquote>${unsafeHTML(editorProps.replyingTo?.contentHTML ?? '')}</blockquote>`,
        )}
        <composer-view
          id=${composerID}
          .entityID=${editorProps.editing?.id ?? ''}
          .entityType=${isReply ? entityReply : entityCmt}
          .submitButtonText=${editorProps.editing ? ls.save : ls.send}
          @onSubmit=${this.handleSubmit}
          @onDiscard=${this.handleDiscard}></composer-view>
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

  private async handleDeleteCmt(e: [string, Cmt]) {
    const [parentID, cmt] = e;
    const isReply = isCmtReply(cmt);
    const loader = new DeleteCmtLoader(cmt.id, this.hostType, this.hostID, isReply);
    const status = await appTask.critical(loader, ls.working);
    if (status.isSuccess) {
      this.hub?.removeCmt(isReply ? parentID : null, cmt.id);
    }
  }

  private async handleSubmit(e: CustomEvent<ComposerContent>) {
    const { editorProps, hub } = this;
    CHECK(hub);

    let loader: SetCmtLoader;
    if (!editorProps.editing) {
      if (editorProps.parent) {
        CHECK(editorProps.replyingTo);
        // Add a reply.
        loader = SetCmtLoader.newReply(
          this.hostID,
          this.hostType,
          // `toUserID`:
          editorProps.replyingTo.userID,
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
      loader = SetCmtLoader.editCmt(
        this.hostID,
        this.hostType,
        editorProps.editing.id,
        isCmtReply(editorProps.editing),
        e.detail,
      );
    }

    const status = await appTask.critical(loader, ls.publishing);
    if (status.data) {
      const serverCmt = status.data.cmt;
      this.closeEditor();

      if (!editorProps.editing) {
        if (editorProps.parent) {
          // Add a reply.
          hub.addCmt(editorProps.parent.id, serverCmt);
        } else {
          // Add a comment.
          hub.addCmt(null, serverCmt);
        }
      } else {
        // Edit a comment or reply.

        // Copy all properties from the comment returned from server except for `createdAt`.
        // We're hot patching the cmt object, and the `createdAt` property
        // is something server must return (an empty timestamp) but doesn't
        // make sense here.
        const newCmt: Cmt = {
          ...editorProps.editing,
        };

        // We have to iterate through response cmt properties and only update non-empty
        // properties.
        for (const [k, v] of Object.entries(serverCmt)) {
          if (v) {
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
            (newCmt as any)[k] = v;
          }
        }

        newCmt.createdAt = editorProps.editing.createdAt;
        hub.updateCmt(editorProps.parent?.id ?? null, newCmt);
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
