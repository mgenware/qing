/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css, state, html, BaseElement, TemplateResult, property } from 'll.js';
import { frozenDef } from '@qing/def';

// Imported types (eliminated after compilation).
import type { KXEditor } from 'kangxi-editor';
import type { MdEditor } from './mdEditor.js';
import { Completer } from 'lib/completer.js';
import { CHECK } from 'checks.js';
import delay from 'lib/delay.js';

export enum CoreEditorContentType {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  html,
  md,
}

export interface CoreEditorContent {
  data: string | undefined;
  type: CoreEditorContentType;
}

export type CoreEditorImpl = KXEditor | MdEditor;

@customElement('core-editor')
/**
 * Don't use this element directly. It doesn't come with any loading UI.
 * Use <composer-view> or <editor-view> instead.
 */
export default class CoreEditor extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .loading-container {
          display: grid;
          place-items: center;
        }

        kx-editor-view,
        md-editor {
          min-height: 300px;
        }
      `,
    ];
  }

  // Prefer using wait() instead of directly accessing this property.
  #unsafeImplEl?: CoreEditorImpl;
  #editorCompleter = new Completer<CoreEditorImpl>();

  get unsafeImplEl(): CoreEditorImpl | undefined {
    return this.#unsafeImplEl;
  }

  @property() editorMode = frozenDef.ContentInputTypeConfig.standard;
  @property() brLoadingDelay = false;
  @property() initialContent?: string;

  @state() private editorTemplate?: TemplateResult;

  override async firstUpdated() {
    await this.startLoadingEditor();
  }

  private async startLoadingEditor() {
    if (this.brLoadingDelay) {
      await delay(3000);
    }
    switch (this.editorMode) {
      case frozenDef.ContentInputTypeConfig.standard: {
        await import('./kxEditorView.js');
        this.editorTemplate = html`<kx-editor-view class="height-100"></kx-editor-view>`;
        break;
      }

      case frozenDef.ContentInputTypeConfig.markdown: {
        await import('./mdEditor.js');
        this.editorTemplate = html`<md-editor class="height-100"></md-editor>`;
        break;
      }

      default: {
        throw new Error(`Unknown input type: ${this.editorMode}`);
      }
    }

    await this.updateComplete;
    // Only after the editor is rendered, we can get the editor element and complete the completer.
    setTimeout(() => {
      let editorEl: CoreEditorImpl | null = null;
      switch (this.editorMode) {
        case frozenDef.ContentInputTypeConfig.standard: {
          editorEl = this.queryShadowElement<KXEditor>('kx-editor-view');
          break;
        }

        case frozenDef.ContentInputTypeConfig.markdown: {
          editorEl = this.queryShadowElement<MdEditor>('md-editor');
          break;
        }

        default:
          break;
      }

      CHECK(editorEl);
      this.#unsafeImplEl = editorEl;

      CHECK(this.#unsafeImplEl);

      if (this.initialContent) {
        this.resetContent(this.#unsafeImplEl, this.initialContent);
      }

      this.#editorCompleter.complete(editorEl);
      this.dispatchEvent(
        new CustomEvent<CoreEditorImpl>('core-editor-ready', { detail: editorEl }),
      );
    }, 0);
  }

  override render() {
    if (this.editorTemplate) {
      return this.editorTemplate;
    }
    return html`
      <div class="loading-container height-100">${globalThis.coreLS.loadingEditor}</div>
    `;
  }

  wait(): Promise<CoreEditorImpl> {
    return this.#editorCompleter.promise;
  }

  getContent(editorEl: CoreEditorImpl): CoreEditorContent {
    if (this.editorMode === frozenDef.ContentInputTypeConfig.standard) {
      const kx = editorEl as KXEditor;
      return {
        data: kx.contentHTML(),
        type: CoreEditorContentType.html,
      };
    }

    const md = editorEl as MdEditor;
    return {
      data: md.getContent(),
      type: CoreEditorContentType.md,
    };
  }

  resetContent(editorEl: CoreEditorImpl, content: string) {
    if (this.editorMode === frozenDef.ContentInputTypeConfig.standard) {
      const kx = editorEl as KXEditor;
      kx.setContentHTML(content);
    } else {
      const md = editorEl as MdEditor;
      md.setContent(content);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'core-editor': CoreEditor;
  }
}
