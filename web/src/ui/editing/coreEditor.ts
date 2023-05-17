/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css, state, html, BaseElement } from 'll.js';
import '../status/spinnerView.js';
import appPageState from 'app/appPageState.js';
import { frozenDef, appDef } from '@qing/def';

// Imported types (eliminated after compilation).
import type { KXEditor } from 'kangxi-editor';
import type { MdEditor } from './mdEditor.js';

export interface CoreEditorContent {
  html: string;
  summary?: string;
  src?: string;
}

export interface CoreEditorGetSummaryOptions {
  summary: boolean;
}

@customElement('core-editor')
export default class CoreEditor extends BaseElement {
  static override get styles() {
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

  // Defaults to undefined which indicates the editor is loading.
  @state() private editorMode?: frozenDef.ContentInputTypeConfig;

  get kxEditorEl(): KXEditor | null {
    return this.queryShadowElement<KXEditor>('kx-editor-view');
  }

  get mdEditorEl(): MdEditor | null {
    return this.queryShadowElement<MdEditor>('md-editor');
  }

  override async firstUpdated() {
    switch (appPageState.inputType) {
      case frozenDef.ContentInputTypeConfig.standard: {
        await import('./kxEditorView.js');
        this.editorMode = frozenDef.ContentInputTypeConfig.standard;
        break;
      }

      case frozenDef.ContentInputTypeConfig.markdown: {
        await import('./mdEditor.js');
        this.editorMode = frozenDef.ContentInputTypeConfig.markdown;
        break;
      }

      default: {
        break;
      }
    }
  }

  override render() {
    if (!this.editorMode) {
      return html`<spinner-view></spinner-view>`;
    }
    if (this.editorMode === frozenDef.ContentInputTypeConfig.markdown) {
      return html` <md-editor></md-editor>`;
    }
    return html` <kx-editor-view></kx-editor-view>`;
  }

  private contentSrc(): string | undefined {
    if (this.editorMode === frozenDef.ContentInputTypeConfig.markdown) {
      return this.mdEditorEl?.getContent() ?? '';
    }
    // Standard editor doesn't have a content source.
    return undefined;
  }

  private contentHTML(): string {
    if (this.editorMode === frozenDef.ContentInputTypeConfig.markdown) {
      return this.mdEditorEl?.getHTML() ?? '';
    }
    return this.kxEditorEl?.contentHTML() ?? '';
  }

  getEditorMode(): frozenDef.ContentInputTypeConfig | undefined {
    return this.editorMode;
  }

  getContent(opt: CoreEditorGetSummaryOptions): CoreEditorContent {
    const contentHTML = this.contentHTML();
    const src = this.contentSrc();
    let summary: string | undefined;
    if (opt.summary) {
      if (this.editorMode === frozenDef.ContentInputTypeConfig.markdown) {
        summary =
          new DOMParser().parseFromString(contentHTML, 'text/html').documentElement.textContent ??
          '';
      } else {
        summary = this.kxEditorEl?.contentText() ?? '';
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
  getRenderedContent(): string {
    if (this.editorMode === frozenDef.ContentInputTypeConfig.markdown) {
      return this.mdEditorEl?.getContent() ?? '';
    }
    return this.kxEditorEl?.contentHTML() ?? '';
  }

  resetRenderedContent(content: string) {
    if (this.editorMode === frozenDef.ContentInputTypeConfig.markdown) {
      this.mdEditorEl?.setContent(content);
    } else {
      this.kxEditorEl?.setContentHTML(content);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'core-editor': CoreEditor;
  }
}
