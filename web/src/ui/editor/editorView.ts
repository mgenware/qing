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

  @property() user = app.state.user;
  firstUpdated() {
    const editorDom = this.shadowRoot!.getElementById('editor');
    if (!editorDom) {
      throw new Error('Editor dom not found');
    }
    Editor.create(editorDom, {
      contentHTML: '<p>Hello World</p>',
      lang: ls._lang === 'cs' ? langCs : langEn,
    });
  }

  render() {
    return html`
      <div id="editor" class="kx-editor"></div>
    `;
  }
}
