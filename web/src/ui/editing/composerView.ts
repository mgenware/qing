/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import {
  BaseElement,
  customElement,
  html,
  css,
  Ref,
  createRef,
  ref,
  TemplateResult,
  property,
  when,
} from 'll.js';
import './editorView';
import { ERR } from 'checks.js';
import 'ui/forms/inputView';
import 'ui/status/statusView';
import EditorView from './editorView.js';
import appAlert from 'app/appAlert.js';
import LoadingStatus from 'lib/loadingStatus.js';
import appTask from 'app/appTask.js';
import { GetEntitySourceLoader } from 'com/postCore/loaders/getEntitySourceLoader.js';
import Entity from 'lib/entity.js';
import strf from 'bowhead-js';

class ValidationError extends Error {
  constructor(msg: string, public callback: () => void) {
    super(msg);
  }
}

export interface ComposerContent {
  contentHTML: string;
  title?: string;
}

/**
 * Built upon editor-view, providing the following features:
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
          display: flex;
          flex-direction: column;
          /** Make sure it stretches to parent height */
          flex: 1 1 auto;
          min-height: 300px;
        }

        .editor-buttons qing-button {
          min-width: var(--app-dialog-btn-min-width);
        }

        .editor-buttons qing-button:not(:first-child) {
          margin-left: var(--app-dialog-btn-spacing);
        }
      `,
    ];
  }

  @property({ type: Boolean }) hasTitle = false;

  @property({ type: Object }) entity?: Entity;
  @property() submitButtonText = '';
  @property() desc = '';

  // Source loading will start when `entityID` changes, it has to default to
  // `true`.
  @property({ type: Object }) loadingStatus = LoadingStatus.notStarted;

  // Used to check if editor content has changed.
  private lastSavedTitle = '';
  private lastSavedContent = '';

  private editorEl: Ref<EditorView> = createRef();
  private titleInputEl: Ref<HTMLInputElement> = createRef();

  hasContentChanged() {
    return (
      this.lastSavedContent !== this.contentHTML ||
      (this.hasTitle && this.lastSavedTitle !== this.titleText)
    );
  }

  markAsSaved() {
    this.lastSavedContent = this.contentHTML ?? '';
    if (this.hasTitle) {
      this.lastSavedTitle = this.titleText ?? '';
    }
  }

  resetEditor() {
    this.lastSavedContent = '';
    this.lastSavedTitle = '';
    this.setTitleText('');
    this.setContentHTML('', false);
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
    if (this.entity) {
      await this.loadEntitySource();
    } else {
      // We are creating a new post, set the loading status to success.
      this.loadingStatus = LoadingStatus.success;
    }
    this.markAsSaved();
  }

  get contentHTML() {
    return this.editorEl.value?.contentHTML;
  }

  get titleText() {
    return this.titleInputEl.value?.value;
  }

  setContentHTML(contentHTML: string, canUndo: boolean) {
    const { editorEl } = this;
    if (editorEl.value) {
      if (canUndo) {
        editorEl.value.contentHTML = contentHTML;
      } else {
        editorEl.value.resetContentHTML(contentHTML);
      }
      this.markAsSaved();
    }
  }

  setTitleText(text: string) {
    if (this.titleInputEl.value) {
      this.titleInputEl.value.value = text;
    }
  }

  override render() {
    const { loadingStatus } = this;

    let editorContent: TemplateResult;
    if (loadingStatus.isSuccess) {
      editorContent = html`<h2>${this.desc}</h2>
        <slot name="header"></slot>
        ${when(
          this.hasTitle,
          () => html`
            <div class="p-b-sm flex-auto">
              <input-view
                ${ref(this.titleInputEl)}
                required
                placeholder=${globalThis.coreLS.title}></input-view>
            </div>
          `,
        )} <editor-view ${ref(this.editorEl)}></editor-view>`;
    } else {
      editorContent = html` <status-view
        .status=${loadingStatus}
        .canRetry=${true}
        @status-view-retry=${this.loadEntitySource}></status-view>`;
    }

    const bottomContent = html`
      <div class="m-t-md flex-auto editor-buttons text-center">
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

    return html`
      <div class="d-flex flex-column flex-full">
        <div
          class="d-flex flex-column flex-full"
          style=${loadingStatus.isSuccess ? '' : 'justify-content: center'}>
          ${editorContent}
        </div>
        ${bottomContent}
      </div>
    `;
  }

  private getPayload(): ComposerContent {
    if (this.hasTitle && !this.titleText) {
      throw new ValidationError(strf(globalThis.coreLS.pPlzEnterThe, globalThis.coreLS.title), () =>
        this.titleInputEl.value?.focus(),
      );
    }
    if (!this.contentHTML) {
      throw new ValidationError(
        strf(globalThis.coreLS.pPlzEnterThe, globalThis.coreLS.content),
        () => this.editorEl.value?.focus(),
      );
    }
    const payload: ComposerContent = {
      contentHTML: this.contentHTML,
    };
    if (this.hasTitle) {
      payload.title = this.titleText;
    }
    return payload;
  }

  private async handleSubmit() {
    try {
      const payload = this.getPayload();
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
    const fireEvent = (contentDiscarded: boolean) => {
      this.markAsSaved();
      this.dispatchEvent(
        new CustomEvent<boolean>('composer-discard', { detail: contentDiscarded }),
      );
    };
    if (this.hasContentChanged()) {
      // Warn the user of unsaved changes.
      if (await appAlert.warnUnsavedChanges()) {
        fireEvent(true);
      }
    } else {
      fireEvent(false);
    }
  }

  // Use arrow func for no `bind` calls.
  private handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (this.hasContentChanged()) {
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
    const loader = new GetEntitySourceLoader(entity);
    const res = await appTask.local(loader, (s) => (this.loadingStatus = s));
    if (res.data) {
      const postData = res.data;
      if (this.titleInputEl.value) {
        this.titleInputEl.value.value = postData.title ?? '';
      }
      if (this.editorEl.value) {
        this.editorEl.value.resetContentHTML(postData.contentHTML ?? '');
      }
      this.markAsSaved();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'composer-view': ComposerView;
  }
}
