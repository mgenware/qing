import { html, customElement, css } from 'lit-element';
import ls from 'ls';
import Editor from 'kangxi-editor';
import langEn from 'kangxi-editor/dist/langs/en';
import langCs from 'kangxi-editor/dist/langs/cs';
import styles from 'kangxi-editor/dist/editor.css';
import BaseElement from 'baseElement';

// A wrapper around the kangxi editor.
@customElement('editor-view')
export default class EditorView extends BaseElement {
  static get styles() {
    return [
      styles,
      css`
        .kx-editor {
          border: 1px solid var(--default-separator-color);
          --kx-back-color: var(--default-back-color);
          --kx-text-color: var(--default-fore-color);
          --kx-toolbar-separator-color: var(--default-separator-color);
          --kx-toolbar-button-color: var(--default-fore-color);
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

  firstUpdated() {
    const editorDom = this.mustGetShadowElement('editor');
    const editor = new Editor(editorDom, {
      lang: ls._lang === 'cs' ? langCs : langEn,
    });
    editor.contentHTML = this.contentHTML;
    this.editor = editor;
  }

  focus() {
    this.editor?.view.focus();
  }

  render() {
    return html` <div id="editor" class="kx-editor"></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'editor-view': EditorView;
  }
}
