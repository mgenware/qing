/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property, when } from 'll.js';
import { frozenDef } from '@qing/def';
import './coreEditor.js';
import { CHECK, ERR } from 'checks.js';
import 'ui/forms/inputView.js';
import 'ui/status/statusOverlay.js';
import 'ui/status/statusView.js';
import CoreEditor, { CoreEditorContent, CoreEditorImpl } from './coreEditor.js';
import appAlert from 'app/appAlert.js';
import LoadingStatus from 'lib/loadingStatus.js';
import appTask from 'app/appTask.js';
import { GetEntitySourceLoader } from 'com/postCore/loaders/getEntitySourceLoader.js';
import Entity from 'lib/entity.js';
import strf from 'bowhead-js';
import { InputView } from 'ui/forms/inputView.js';

const titleInputID = 'title-input';

class ValidationError extends Error {
  constructor(msg: string, public callback: () => void) {
    super(msg);
  }
}

export interface ComposerContent extends CoreEditorContent {
  title?: string;
}

/**
 * Built upon core-editor, providing the following features:
 *   Title, and content fields.
 *   Warns the user about unsaved changes.
 *   Submit and cancel buttons.
 */
@customElement('composer-view')
export class ComposerView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          min-height: 300px;
        }

        .editor-buttons qing-button {
          min-width: var(--app-dialog-btn-min-width);
        }

        .editor-buttons qing-button:not(:first-child) {
          margin-left: var(--app-dialog-btn-spacing);
        }

        core-editor {
          height: 100%;
          min-height: 0;
        }
      `,
    ];
  }

  @property({ type: Boolean }) hasTitle = false;

  @property() editorMode = frozenDef.ContentInputTypeConfig.standard;
  @property({ type: Object }) entity?: Entity;
  @property() submitButtonText = '';
  @property() desc = '';

  // Source loading will start when `entityID` changes, it has to default to
  // `true`.
  @property({ type: Object }) loadingStatus = LoadingStatus.notStarted;

  // Used to check if editor content has changed.
  private lastSavedTitle = '';
  // Could be content HTML or src based on editor input type.
  private lastSavedContent = '';

  private get editorEl(): CoreEditor {
    const el = this.queryShadowElement<CoreEditor>('core-editor');
    CHECK(el, 'Editor element not found');
    return el;
  }

  private get titleInputEl(): InputView | null {
    return this.getShadowElement<InputView>(titleInputID);
  }

  get unsafeEditorImplEl(): CoreEditorImpl | undefined {
    return this.editorEl.unsafeImplEl;
  }

  hasContentChanged(impl: CoreEditorImpl): boolean {
    const renderedContent = this.editorEl.getRenderedContent(impl);
    return (
      this.lastSavedContent !== renderedContent ||
      (this.hasTitle && this.lastSavedTitle !== this.titleText)
    );
  }

  markAsSaved(impl: CoreEditorImpl) {
    this.lastSavedContent = this.editorEl.getRenderedContent(impl);
    if (this.hasTitle) {
      this.lastSavedTitle = this.titleText ?? '';
    }
  }

  resetComposer(impl: CoreEditorImpl) {
    this.lastSavedContent = '';
    this.lastSavedTitle = '';
    this.setTitleText('');
    this.editorEl.resetRenderedContent(impl, '');
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  override async firstUpdated() {
    // Wait for the editor to be ready.
    const impl = await this.editorEl.wait();
    if (this.entity) {
      await this.loadEntitySource();
    } else {
      // We are creating a new post, set the loading status to success.
      this.loadingStatus = LoadingStatus.success;
    }
    this.markAsSaved(impl);
  }

  get titleText(): string | undefined {
    return this.titleInputEl?.value;
  }

  setTitleText(text: string) {
    if (this.titleInputEl) {
      this.titleInputEl.value = text;
    }
  }

  override render() {
    const { loadingStatus } = this;

    const editorContent = html`${when(
        this.desc,
        () => html`<h2 class="flx-auto">${this.desc}</h2>`,
      )}
      <slot name="header" class="flx-auto"></slot>
      ${when(
        this.hasTitle,
        () => html`
          <div class="p-b-sm flx-auto">
            <input-view
              id=${titleInputID}
              required
              placeholder=${globalThis.coreLS.title}></input-view>
          </div>
        `,
      )}
      <core-editor
        .editorMode=${this.editorMode}
        class="flx-fill"
        style="flex-basis:0"></core-editor>`;

    const bottomContent = html`
      <div class="m-t-md flx-auto editor-buttons text-center">
        ${when(
          loadingStatus.isSuccess,
          () => html`<qing-button btnStyle="success" @click=${this.handleSubmit}>
            ${this.entity
              ? globalThis.coreLS.save
              : this.submitButtonText || globalThis.coreLS.publish}
          </qing-button>`,
        )}
        <qing-button @click=${this.handleCancel}
          >${loadingStatus.hasError
            ? globalThis.coreLS.close
            : globalThis.coreLS.cancel}</qing-button
        >
      </div>
    `;

    const body = html`
      <div class="height-100 flx-col">
        <div class="flx-fill flx-col">${editorContent}</div>
        ${bottomContent}
      </div>
    `;

    return html`<status-overlay
      class="height-100"
      constrained
      .status=${loadingStatus}
      .canRetry=${true}
      @status-overlay-retry=${this.loadEntitySource}
      >${body}</status-overlay
    >`;
  }

  getPayload(impl: CoreEditorImpl): ComposerContent {
    if (this.hasTitle && !this.titleText) {
      throw new ValidationError(strf(globalThis.coreLS.pPlzEnterThe, globalThis.coreLS.title), () =>
        this.titleInputEl?.focus(),
      );
    }
    const content = this.editorEl.getContent(impl, { summary: this.hasTitle });
    if (!content.src && !content.html) {
      throw new ValidationError(
        strf(globalThis.coreLS.pPlzEnterThe, globalThis.coreLS.content),
        () => this.editorEl.focus(),
      );
    }
    const payload: ComposerContent = {
      ...content,
    };
    if (this.hasTitle) {
      payload.title = this.titleText;
    }
    return payload;
  }

  private async handleSubmit(impl: CoreEditorImpl) {
    try {
      const payload = this.getPayload(impl);
      this.dispatchEvent(new CustomEvent<ComposerContent>('composer-submit', { detail: payload }));
    } catch (err) {
      ERR(err);
      await appAlert.error(err.message);
      if (err instanceof ValidationError) {
        err.callback();
      }
    }
  }

  async clickCancel() {
    await this.handleCancel();
  }

  private async handleCancel() {
    const fireEvent = (impl: CoreEditorImpl | undefined, contentDiscarded: boolean | undefined) => {
      // No-op if the editor is not loaded yet.
      if (impl) {
        this.markAsSaved(impl);
      }
      this.dispatchEvent(
        new CustomEvent<boolean | undefined>('composer-discard', { detail: contentDiscarded }),
      );
    };

    const unsafeImpl = this.editorEl.unsafeImplEl;
    if (!unsafeImpl) {
      fireEvent(undefined, undefined);
      return;
    }
    const impl = unsafeImpl;
    if (this.hasContentChanged(impl)) {
      // Warn the user of unsaved changes.
      if (await appAlert.warnUnsavedChanges()) {
        fireEvent(impl, true);
      }
    } else {
      fireEvent(impl, false);
    }
  }

  // Use arrow func for no `bind` calls.
  private handleBeforeUnload = (e: BeforeUnloadEvent) => {
    const unsafeImpl = this.editorEl.unsafeImplEl;
    if (!unsafeImpl) {
      // No-op if the editor is not loaded yet.
      return;
    }
    if (this.hasContentChanged(unsafeImpl)) {
      // Cancel the event as stated by the standard.
      e.preventDefault();
      // Chrome requires returnValue to be set.
      e.returnValue = '';
    }
  };

  private async loadEntitySource() {
    const { entity } = this;
    if (!entity) {
      return;
    }
    const impl = await this.editorEl.wait();
    const loader = new GetEntitySourceLoader(entity);
    const res = await appTask.local(loader, (s) => (this.loadingStatus = s));
    if (res.data) {
      const postData = res.data;
      if (this.titleInputEl) {
        this.titleInputEl.value = postData.title ?? '';
      }
      this.editorEl.resetRenderedContent(impl, postData.contentSrc ?? postData.contentHTML ?? '');
      this.markAsSaved(impl);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'composer-view': ComposerView;
  }
}
