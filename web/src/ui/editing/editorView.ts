/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { customElement, css, state, html, BaseElement } from 'll.js';
import '../status/spinnerView.js';
import appPageState from 'app/appPageState.js';
import { frozenDef } from '@qing/def';

// Imported types (eliminated after compilation).
import type { KXEditor } from 'kangxi-editor';
import type { MdEditor } from './mdEditor.js';

@customElement('editor-view')
export default class EditorView extends BaseElement {
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
  @state() editorMode?: frozenDef.ContentInputTypeConfig;

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
}

declare global {
  interface HTMLElementTagNameMap {
    'editor-view': EditorView;
  }
}
