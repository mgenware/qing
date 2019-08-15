import { html, customElement, property, LitElement, css } from 'lit-element';
import ls from 'ls';
import Editor from 'kangxi-editor';
import styles from 'app/styles/kangxi';
import langEn from 'kangxi-editor/dist/langs/en';
import langCs from 'kangxi-editor/dist/langs/cs';

@customElement('editor-view')
export default class EditorView extends LitElement {
  static get styles() {
    return [
      styles,
      css`
        .kx-editor {
          border: 1px solid #ededed;
        }
      `,
    ];
  }

  @property() initialContentHTML = '';
  private editor!: Editor;

  get contentHTML(): string {
    return this.editor.contentHTML;
  }

  firstUpdated() {
    const editorDom = this.shadowRoot!.getElementById('editor');
    if (!editorDom) {
      throw new Error('Editor element not found');
    }
    const editor = Editor.create(editorDom, {
      contentHTML: this.initialContentHTML,
      lang: ls._lang === 'cs' ? langCs : langEn,
    });
    this.editor = editor;
  }

  focus() {
    this.editor.view.focus();
  }

  render() {
    return html`
      <div id="editor" class="kx-editor"></div>
    `;
  }
}
