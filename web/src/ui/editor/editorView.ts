/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css } from 'll';
import ls from 'ls';
import { Editor } from 'kangxi-editor';
import styles from 'kangxi-editor/dist/editor.css';
import BaseElement from 'baseElement';

const editorID = 'editor';

// A wrapper around the kangxi editor.
@customElement('editor-view')
export default class EditorView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          /** Make sure it stretches to parent height */
          flex: 1 1 auto;
        }

        .kx-editor {
          border: 1px solid var(--app-default-separator-color);
          --kx-back-color: var(--app-default-back-color);
          --kx-text-color: var(--app-default-fore-color);
          --kx-toolbar-separator-color: var(--app-default-separator-color);
          --kx-toolbar-button-color: var(--app-default-fore-color);

          display: flex;
          flex-direction: column;
          /** Make sure it stretches to parent height */
          flex: 1 1 auto;
        }

        .kx-content {
          flex: 1 1 auto;
        }
      `,
    ];
  }

  // ==========
  // We're using a standard property instead of a lit-element property for performance reason.
  // Keep assigning and comparing lit-element property changes hurts performance.
  // ==========
  // Use to store the property value before editor instance is created.
  private initialContentHTML = '';
  get contentHTML(): string {
    return this.editor ? this.editor.contentHTML : this.initialContentHTML;
  }

  set contentHTML(val: string) {
    this.initialContentHTML = val;
    if (this.editor) {
      this.editor.contentHTML = val;
    }
  }

  private editor?: Editor;
  private get editorEl(): HTMLElement | null {
    return this.getShadowElement(editorID);
  }

  firstUpdated() {
    if (!this.editorEl) {
      return;
    }
    const editor = new Editor(this.editorEl, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lang: ls as any,
    });
    editor.contentHTML = this.contentHTML;
    this.editor = editor;
  }

  focus() {
    this.editor?.view.focus();
  }

  render() {
    return html`<div id=${editorID} class="kx-editor flex-full"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'editor-view': EditorView;
  }
}
