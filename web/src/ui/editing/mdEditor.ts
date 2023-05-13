/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, property, css } from 'll.js';
import { basicSetup, EditorView } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import AppSettings from 'app/appSettings.js';
import appState from 'app/appState.js';
import appStateName from 'app/appStateName.js';
import { StateEffect } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';

@customElement('md-editor')
export class MdEditor extends BaseElement {
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

        #editor {
          display: flex;
          flex-direction: column;
          /** Make sure it stretches to parent height */
          flex: 1 1 auto;
          min-height: 0;
        }

        .cm-editor {
          height: 100%;
        }

        .cm-content {
          font-size: 1rem;
        }
      `,
    ];
  }

  @property() initialContent = '';

  #editorView?: EditorView;
  #extensionsLight = [basicSetup, markdown({ codeLanguages: languages })];
  #extensionsDark = [basicSetup, markdown({ codeLanguages: languages }), oneDark];

  get editorEl(): HTMLElement {
    return this.unsafeGetShadowElement('editor');
  }

  override firstUpdated() {
    const editor = new EditorView({
      doc: this.initialContent,
      extensions: this.#getExtensions(),
      parent: this.editorEl,
    });
    this.#editorView = editor;

    appState.observe(appStateName.isDarkTheme, () => {
      editor.dispatch({
        effects: StateEffect.reconfigure.of(this.#getExtensions()),
      });
    });
  }

  override render() {
    return html` <div id="editor"></div> `;
  }

  getContent(): string {
    return this.#editorView?.state.doc.toString() ?? '';
  }

  #getExtensions() {
    const extensions = AppSettings.isDarkTheme() ? this.#extensionsDark : this.#extensionsLight;
    return extensions;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-editor': MdEditor;
  }
}
