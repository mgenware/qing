import { html, customElement, css } from 'lit-element';
import ls from 'ls';
import Editor from 'kangxi-editor';
import styles from 'app/styles/kangxi-min';
import langEn from 'kangxi-editor/dist/langs/en';
import langCs from 'kangxi-editor/dist/langs/cs';
import BaseElement from 'baseElement';

@customElement('editor-view')
export default class EditorView extends BaseElement {
  static get styles() {
    return [
      styles,
      css`
        .kx-editor {
          border: 1px solid var(--main-secondary-tint-color);
        }
      `,
    ];
  }

  // We're using a standard object property here as it doesn't need to trigger re-render.
  private _contentHTML = '';
  get contentHTML(): string {
    return this._contentHTML;
  }
  set contentHTML(val: string) {
    if (val !== this._contentHTML) {
      this._contentHTML = val;
    }
  }

  private editor!: Editor;

  firstUpdated() {
    const editorDom = this.mustGetShadowElement('editor');
    const editor = new Editor(editorDom, {
      lang: ls._lang === 'cs' ? langCs : langEn,
    });
    editor.contentChanged = () => {
      this.dispatchEvent(
        new CustomEvent<string>('contentChanged', {
          detail: editor.contentHTML,
        }),
      );
    };
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

declare global {
  interface HTMLElementTagNameMap {
    'editor-view': EditorView;
  }
}
