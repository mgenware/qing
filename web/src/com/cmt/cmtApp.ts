/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when, property, state } from 'll';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import './views/rootCmtList';
import Entity from 'lib/entity';
import { CHECK } from 'checks';
import 'qing-overlay';
import 'ui/editing/composerView';
import { Cmt, isCmtReply } from './data/cmt';
import { appdef } from '@qing/def';
import ls, { formatLS } from 'ls';
import { ComposerContent, ComposerView } from 'ui/editing/composerView';
import { SetCmtLoader } from './loaders/setCmtLoader';
import appTask from 'app/appTask';
import { CmtEditorProps, openEditorResultEvent, CmtEditorResult } from './data/events';
import { ItemsChangedEvent } from 'lib/itemCollector';
import appEventEmitter from 'app/appEventEmitter';

const composerID = 'composer';

@customElement('cmt-app')
export class CmtApp extends BaseElement {
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

  @property({ type: Number }) initialTotalCmtCount = 0;
  @property({ type: Object }) host!: Entity;

  @state() private _editorProps = this.closedEditorProps();

  // The number of all comments and their replies.
  @state() private _totalCmtCount = 0;

  override firstUpdated() {
    CHECK(this.host);
    this._totalCmtCount = this.initialTotalCmtCount;
  }

  private get composerEl(): ComposerView | null {
    return this.getShadowElement(composerID);
  }

  override render() {
    const { _editorProps: editorProps } = this;
    let heading: string;
    if (editorProps.to) {
      heading = formatLS(ls.pReplyTo, editorProps.to.userName);
    } else if (editorProps.editing) {
      heading = ls.editComment;
    } else {
      heading = ls.writeAComment;
    }

    return html`
      <root-cmt-list
        .totalCmtCount=${this._totalCmtCount}
        .host=${this.host}
        .loadOnVisible=${!!this.initialTotalCmtCount}
        @onCmtItemsChange=${this.handleAnyItemsChanged}
        @onRequestCmtEditorOpen=${this.handleOpenCmtEditorRequested}></root-cmt-list>
      <qing-overlay class="immersive" ?open=${!!editorProps.session}>
        <h2>${heading}</h2>
        ${when(
          editorProps.to,
          () => html`<blockquote>${unsafeHTML(editorProps.to?.contentHTML ?? '')}</blockquote>`,
        )}
        <composer-view
          id=${composerID}
          .entityID=${editorProps.editing?.id ?? ''}
          .entityType=${appdef.contentBaseTypeCmt}
          .submitButtonText=${editorProps.editing ? ls.save : ls.send}
          @onSubmit=${this.handleSubmit}
          @onCancel=${this.handleCancel}></composer-view>
      </qing-overlay>
    `;
  }

  private handleCancel() {
    this.sendEditorResult({ canceled: true });
    this.closeEditor();
  }

  private closeEditor() {
    this._editorProps = this.closedEditorProps();
    this.composerEl?.resetEditor();
  }

  private sendEditorResult(res: CmtEditorResult) {
    const { session } = this._editorProps;
    CHECK(session);
    const event = openEditorResultEvent(session);
    appEventEmitter.dispatch(event, res);
  }

  private async handleSubmit(e: CustomEvent<ComposerContent>) {
    const { _editorProps: editorProps } = this;
    CHECK(editorProps.session);

    let loader: SetCmtLoader;
    if (!editorProps.editing) {
      if (editorProps.to) {
        // Add a reply.
        loader = SetCmtLoader.newReply(
          this.host,
          // `parentID`:
          editorProps.to.id,
          e.detail,
        );
      } else {
        // Add a comment.
        loader = SetCmtLoader.newCmt(this.host, e.detail);
      }
    } else {
      // Edit a comment or reply.
      loader = SetCmtLoader.editCmt(
        this.host,
        editorProps.editing.id,
        isCmtReply(editorProps.editing),
        e.detail,
      );
    }

    const apiRes = await appTask.critical(loader, ls.publishing);
    if (apiRes.error) {
      this.sendEditorResult({ err: apiRes.error });
    } else if (apiRes.data) {
      const serverCmt = apiRes.data.cmt;

      if (!editorProps.editing) {
        // Adding a cmt or reply.
        this.sendEditorResult({ cmt: serverCmt });
      } else {
        // Editing a cmt or reply.

        // Copy all properties from the comment returned from server except for `createdAt`.
        // We're hot patching the cmt object, and the `createdAt` property
        // is something server must return (an empty timestamp) but doesn't
        // make sense here.
        const updatedCmt: Cmt = {
          ...editorProps.editing,
        };

        // We have to iterate through response cmt properties and only update non-empty
        // properties.
        for (const [k, v] of Object.entries(serverCmt)) {
          if (v) {
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
            (updatedCmt as any)[k] = v;
          }
        }

        updatedCmt.createdAt = editorProps.editing.createdAt;
        this.sendEditorResult({ cmt: updatedCmt });
      }

      // Close editor only when API is successfully completed.
      this.closeEditor();
    }
  }

  private closedEditorProps(): CmtEditorProps {
    return {
      editing: null,
      to: null,
      session: null,
    };
  }

  // Handles all `onCmtItemsChange` events from descendants.
  // This is to track cmt count changes.
  private handleAnyItemsChanged(e: CustomEvent<ItemsChangedEvent<Cmt>>) {
    e.stopPropagation();
    const change = e.detail;
    if (!change.triggeredByLoading) {
      this._totalCmtCount += change.detail.countDelta;
    }
  }

  private handleOpenCmtEditorRequested(e: CustomEvent<CmtEditorProps>) {
    e.stopPropagation();
    this._editorProps = e.detail;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cmt-app': CmtApp;
  }
}
