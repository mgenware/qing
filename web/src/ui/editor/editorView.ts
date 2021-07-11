/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement } from 'll';
import ls from 'ls';
import { Editor, Lang } from 'kangxi-editor';
import styles from 'kangxi-editor/dist/editor.css.js';

const editorID = 'editor';

// A wrapper around the kangxi editor.
@customElement('editor-view')
export default class EditorView extends BaseElement {
  static get styles() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
          --kx-fore-color: var(--app-default-fore-color);
          --kx-toolbar-separator-color: var(--app-default-separator-color);

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

  // Used to store content HTML when editor view is not available.
  private backupContentHTML = '';
  getContentHTML(): string {
    return this.editor ? this.editor.contentHTML() : this.backupContentHTML;
  }

  setContentHTML(val: string, canUndo: boolean) {
    this.backupContentHTML = val;
    if (this.editor) {
      if (canUndo) {
        this.editor.setContentHTML(val);
      } else {
        this.editor.resetContentHTML(val);
      }
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
      lang: ls as Lang,
    });
    editor.resetContentHTML(this.backupContentHTML);
    this.editor = editor;
  }

  focus() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
