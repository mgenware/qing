/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, TemplateResult, PropertyValues } from 'lit-element';
import * as lp from 'lit-props';
import { ls, formatLS } from 'ls';
import BaseElement from 'baseElement';
import './editorView';
import 'ui/form/inputView';
import 'ui/status/statusView';
import EditorView from './editorView';
import { CHECK } from 'checks';
import { tif } from 'lib/htmlLib';
import appAlert from 'app/appAlert';
import LoadingStatus from 'lib/loadingStatus';
import appTask from 'app/appTask';
import { GetEntitySourceLoader } from 'post/loaders/getEntitySourceLoader';

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
@customElement('composer-view')
export class ComposerView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          /** Make sure it stretches to parent height */
          flex: 1 1 auto;
        }
      `,
    ];
  }

  @lp.number entityType = 0;

  // Title field value.
  @lp.string inputTitle = '';
  @lp.bool showTitleInput = false;

  @lp.string entityID = '';
  @lp.string submitButtonText = '';

  // Source loading will start when `entityID` changes, it has to default to
  // `true`.
  @lp.object loadingStatus = LoadingStatus.success;

  // Used to check if editor content has changed.
  private lastSavedTitle = '';
  private lastSavedContent = '';

  hasContentChanged(): boolean {
    if (!this.editorEl) {
      return false;
    }
    return (
      this.lastSavedContent !== this.contentHTML ||
      (this.showTitleInput && this.lastSavedTitle !== this.inputTitle)
    );
  }

  markAsSaved() {
    this.lastSavedContent = this.contentHTML;
    if (this.showTitleInput) {
      this.lastSavedTitle = this.inputTitle;
    }
  }

  resetEditor() {
    this.lastSavedContent = '';
    this.lastSavedTitle = '';
    this.initialContentHTML = '';
    this.inputTitle = '';
    this.contentHTML = '';
  }

  private updateEditorContent(title: string, contentHTML: string) {
    const { editorEl } = this;
    this.inputTitle = title;
    if (editorEl) {
      editorEl.contentHTML = contentHTML;
      this.markAsSaved();
    }
  }

  private get editorEl(): EditorView | null {
    return this.getShadowElement(editorID);
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
      editorEl.contentHTML = this.contentHTML;
    }
    this.markAsSaved();
  }

  // ==========
  // We're using a standard property instead of a lit-element property for performance reason.
  // Keep assigning and comparing lit-element property might hurt performance?
  // ==========
  // Used to store the property value before editor instance is created.
  private initialContentHTML = '';
  get contentHTML(): string {
    return this.editorEl ? this.editorEl.contentHTML : this.initialContentHTML;
  }

  set contentHTML(val: string) {
    this.initialContentHTML = val;
    if (this.editorEl) {
      this.editorEl.contentHTML = val;
    }
  }

  render() {
    const { loadingStatus } = this;

    let editorContent: TemplateResult;
    if (loadingStatus.isSuccess) {
      editorContent = html`${tif(
          this.showTitleInput,
          html`
            <div class="p-b-sm flex-auto">
              <input-view
                id=${titleInputID}
                required
                .placeholder=${ls.title}
                .value=${this.inputTitle}
                @onChange=${(e: CustomEvent<string>) => (this.inputTitle = e.detail)}
              ></input-view>
            </div>
          `,
        )} <editor-view id=${editorID}></editor-view>`;
    } else {
      editorContent = html` <status-view
        .status=${loadingStatus}
        .canRetry=${true}
        @onRetry=${this.loadEntitySource}
      ></status-view>`;
    }

    const bottomContent = html`
      <div class="m-t-md flex-auto text-center">
        ${tif(
          loadingStatus.isSuccess,
          html` <qing-button btnStyle="success" @click=${this.handleSubmit}>
            ${this.entityID ? ls.save : this.submitButtonText || ls.publish}
          </qing-button>`,
        )}
        <qing-button class="m-l-sm" @click=${this.handleCancel}
          >${loadingStatus.hasError ? ls.close : ls.cancel}</qing-button
        >
      </div>
    `;

    return html`
      <div class="d-flex flex-column flex-full">
        <div
          class="d-flex flex-column flex-full"
          style=${loadingStatus.isSuccess ? '' : 'justify-content: center'}
        >
          ${editorContent}
        </div>
        ${bottomContent}
      </div>
    `;
  }

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('entityID') && this.entityID) {
      this.loadEntitySource();
    }
  }

  private getPayload(): ComposerContent {
    if (this.showTitleInput && !this.inputTitle) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.title), () =>
        this.titleInputEl?.focus(),
      );
    }
    if (!this.contentHTML) {
      throw new ValidationError(formatLS(ls.pPlzEnterThe, ls.content), () =>
        this.editorEl?.focus(),
      );
    }
    const payload: ComposerContent = {
      contentHTML: this.contentHTML,
    };
    if (this.showTitleInput) {
      payload.title = this.inputTitle;
    }
    return payload;
  }

  private async handleSubmit() {
    try {
      const payload = this.getPayload();
      this.dispatchEvent(
        new CustomEvent<ComposerContent>('onSubmit', { detail: payload }),
      );
    } catch (err) {
      await appAlert.error(err.message);
      if (err instanceof ValidationError) {
        const verr = err as ValidationError;
        verr.callback();
      }
    }
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
      this.updateEditorContent(postData.title ?? '', postData.contentHTML);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'composer-view': ComposerView;
  }
}
