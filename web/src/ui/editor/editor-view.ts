import { html, customElement, property } from 'lit-element';
import ls from '../../ls';
import app from '../../app';
import Element from '../../element';
import Editor from 'kangxi-editor';
import styles from '../../app/styles/kangxi';
import langEn from 'kangxi-editor/dist/langs/en';
import langCs from 'kangxi-editor/dist/langs/cs';

@customElement('editor-view')
export default class EditorView extends Element {
  static get styles() {
    return styles;
  }

  @property({
    hasChanged: (newVal, oldVal) => {
      this.editor.contentHTML = newVal;
      return newVal !== oldVal;
    },
  })
  contentHTML = '';

  private editor: Editor;

  firstUpdated() {
    const editorDom = this.shadowRoot!.getElementById('editor');
    if (!editorDom) {
      throw new Error('Editor dom not found');
    }
    this.editor = Editor.create(editorDom, {
      contentHTML: this.contentHTML,
      lang: ls._lang === 'cs' ? langCs : langEn,
    });
  }

  render() {
    return html`
      <div id="editor" class="kx-editor"></div>
    `;
  }
}
