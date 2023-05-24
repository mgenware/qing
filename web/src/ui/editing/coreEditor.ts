/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css, state, html, BaseElement, TemplateResult, property } from 'll.js';
import { frozenDef, appDef } from '@qing/def';

// Imported types (eliminated after compilation).
import type { KXEditor } from 'kangxi-editor';
import type { MdEditor } from './mdEditor.js';
import { Completer } from 'lib/completer.js';
import { CHECK } from 'checks.js';

export interface CoreEditorContent {
  html: string;
  summary?: string;
  src?: string;
}

export interface CoreEditorGetSummaryOptions {
  summary: boolean;
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
          height: 100%;
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
  @state() private editorTemplate?: TemplateResult;

  override async firstUpdated() {
    await this.startLoadingEditor();
  }

  private async startLoadingEditor() {
    this.dispatchEvent(new CustomEvent('core-editor-loading'));
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

      CHECK(editorEl, 'Editor element is null after loading');
      this.#editorCompleter.complete(editorEl);
      this.dispatchEvent(new CustomEvent('core-editor-loaded'));
    }, 0);
  }

  override render() {
    return html`<div class="height-100">${this.editorTemplate ? this.editorTemplate : ''}</div>`;
  }

  wait(): Promise<CoreEditorImpl> {
    return this.#editorCompleter.promise;
  }

  private contentSrc(editorEl: CoreEditorImpl): string | undefined {
    if (this.editorMode === frozenDef.ContentInputTypeConfig.standard) {
      // Standard editor doesn't have a content source.
      return undefined;
    }
    const md = editorEl as MdEditor;
    return md.getContent() ?? '';
  }

  private contentHTML(editorEl: CoreEditorImpl): string {
    if (this.editorMode === frozenDef.ContentInputTypeConfig.standard) {
      const kx = editorEl as KXEditor;
      return kx.contentHTML() ?? '';
    }
    const md = editorEl as MdEditor;
    return md.getHTML() ?? '';
  }

  getContent(editorEl: CoreEditorImpl, opt: CoreEditorGetSummaryOptions): CoreEditorContent {
    const contentHTML = this.contentHTML(editorEl);
    const src = this.contentSrc(editorEl);
    let summary: string | undefined;
    if (opt.summary) {
      if (this.editorMode === frozenDef.ContentInputTypeConfig.standard) {
        // KXEditor has summary data in it.
        const kx = editorEl as KXEditor;
        summary = kx.contentText() ?? '';
      } else {
        // For md editor, we need to parse the HTML to get the summary.
        summary =
          new DOMParser().parseFromString(contentHTML, 'text/html').documentElement.textContent ??
          '';
      }
      const summaryMaxLen = appDef.lenMaxPostSummary - 10; // make some room for '...';
      summary = summary.trim();
      summary =
        summary.length > summaryMaxLen ? `${summary.substring(0, summaryMaxLen)}...` : summary;
    }

    return {
      html: contentHTML,
      src,
      summary,
    };
  }

  // Returns the rendered content. For md editor, it's markdown. For standard editor, it's HTML.
  getRenderedContent(editorEl: CoreEditorImpl): string {
    if (this.editorMode === frozenDef.ContentInputTypeConfig.standard) {
      const kx = editorEl as KXEditor;
      return kx.contentHTML() ?? '';
    }
    const md = editorEl as MdEditor;
    return md.getContent() ?? '';
  }

  resetRenderedContent(editorEl: CoreEditorImpl, content: string) {
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
