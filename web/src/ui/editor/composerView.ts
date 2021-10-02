/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import { ls, formatLS } from 'ls';
import './editorView';
import { ERR } from 'checks';
import 'ui/form/inputView';
import 'ui/status/statusView';
import EditorView from './editorView';
import { CHECK } from 'checks';
import { tif } from 'lib/htmlLib';
import appAlert from 'app/appAlert';
import LoadingStatus from 'lib/loadingStatus';
import appTask from 'app/appTask';
import { GetEntitySourceLoader } from 'com/postCore/loaders/getEntitySourceLoader';

const editorID = 'editor';
const titleInputID = 'title-input';

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
@ll.customElement('composer-view')
export class ComposerView extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: flex;
          flex-direction: column;
          /** Make sure it stretches to parent height */
          flex: 1 1 auto;
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

  @ll.number entityType = 0;

  // Title field value.
  @ll.string inputTitle = '';
  @ll.bool showTitleInput = false;

  @ll.string entityID = '';
  @ll.string submitButtonText = '';

  // Source loading will start when `entityID` changes, it has to default to
  // `true`.
  @ll.object loadingStatus = LoadingStatus.success;

  // Used to check if editor content has changed.
  private lastSavedTitle = '';
  private lastSavedContent = '';

  private editorEl: Ref<EditorView> = createRef;

  hasContentChanged(): boolean {
    if (!this.editorEl) {
      return false;
    }
    return (
      this.lastSavedContent !== this.getContentHTML() ||
      (this.showTitleInput && this.lastSavedTitle !== this.inputTitle)
    );
  }

  markAsSaved() {
    this.lastSavedContent = this.getContentHTML();
    if (this.showTitleInput) {
      this.lastSavedTitle = this.inputTitle;
    }
  }

  resetEditor() {
    this.lastSavedContent = '';
    this.lastSavedTitle = '';
    this.backupContentHTML = '';
    this.inputTitle = '';
    this.setContentHTML('', false);
  }

  private updateEditorContent(title: string, contentHTML: string, canUndo: boolean) {
    const { editorEl } = this;
    this.inputTitle = title;
    if (editorEl) {
      editorEl.setContentHTML(contentHTML, canUndo);
      this.markAsSaved();
    }
  }

  private get titleInputEl(): HTMLInputElement | null {
    return this.getShadowElement(titleInputID);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  firstUpdated() {
    CHECK(this.entityType);

    // Sync `contentHTML` (`contentHTML` might be set before editor el is connected to DOM).
    const { editorEl } = this;
    if (editorEl) {
      editorEl.setContentHTML(this.backupContentHTML, false);
    }
    this.markAsSaved();
  }

  // Used to store content HTML when editor view is not available.
  private backupContentHTML = '';
  getContentHTML(): string {
    return this.editorEl ? this.editorEl.getContentHTML() : this.backupContentHTML;
  }

  setContentHTML(val: string, canUndo: boolean) {
    this.backupContentHTML = val;
    if (this.editorEl) {
      this.editorEl.setContentHTML(val, canUndo);
    }
  }

  render() {
    const { loadingStatus } = this;

    let editorContent: TemplateResult;
    if (loadingStatus.isSuccess) {
      editorContent = ll.html`${tif(
        this.showTitleInput,
        ll.html`
            <div class="p-b-sm flex-auto">
              <input-view
                id=${titleInputID}
                required
                .placeholder=${ls.title}
                .value=${this.inputTitle}
                @onChange=${(e: CustomEvent<string>) => (this.inputTitle = e.detail)}></input-view>
            </div>
          `,
      )} <editor-view id=${editorID}></editor-view>`;
    } else {
      editorContent = ll.html` <status-view
        .status=${loadingStatus}
        .canRetry=${true}
        @onRetry=${this.loadEntitySource}></status-view>`;
    }

    const bottomContent = ll.html`
      <div class="m-t-md flex-auto text-center editor-buttons">
        ${tif(
          loadingStatus.isSuccess,
          ll.html`<qing-button btnStyle="success" @click=${this.handleSubmit}>
            ${this.entityID ? ls.save : this.submitButtonText || ls.publish}
          </qing-button>`,
        )}
        <qing-button @click=${this.handleCancel}
          >${loadingStatus.hasError ? ls.close : ls.cancel}</qing-button
        >
      </div>
    `;

    return ll.html`
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

  async updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('entityID') && this.entityID) {
      await this.loadEntitySource();
    }
  }

  private getPayload(): ComposerContent {
    if (this.showTitleInput && !this.inputTitle) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.title), () =>
        this.titleInputEl?.focus(),
      );
    }
    const content = this.getContentHTML();
    if (!content) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.content), () =>
        this.editorEl?.focus(),
      );
    }
    const payload: ComposerContent = {
      contentHTML: content,
    };
    if (this.showTitleInput) {
      payload.title = this.inputTitle;
    }
    return payload;
  }

  private async handleSubmit() {
    try {
      const payload = this.getPayload();
      this.dispatchEvent(new CustomEvent<ComposerContent>('onSubmit', { detail: payload }));
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
    const fireEvent = () => {
      this.markAsSaved();
      this.dispatchEvent(new CustomEvent('onDiscard'));
    };
    if (this.hasContentChanged()) {
      // Warn user of unsaved changes.
      if (await appAlert.warnUnsavedChanges()) {
        fireEvent();
      }
    } else {
      fireEvent();
    }
  }

  private handleBeforeUnload(e: BeforeUnloadEvent) {
    if (this.hasContentChanged()) {
      // Cancel the event as stated by the standard.
      e.preventDefault();
      // Chrome requires returnValue to be set.
      e.returnValue = '';
    }
  }

  private async loadEntitySource() {
    const { entityID, entityType } = this;
    if (!entityID) {
      return;
    }
    const loader = new GetEntitySourceLoader(entityType, entityID);
    const res = await appTask.local(loader, (s) => (this.loadingStatus = s));
    if (res.data) {
      const postData = res.data;
      this.updateEditorContent(postData.title ?? '', postData.contentHTML, false);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'composer-view': ComposerView;
  }
}
