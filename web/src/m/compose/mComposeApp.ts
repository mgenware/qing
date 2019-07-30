import { html, customElement } from 'lit-element';
import Element from '../../element';
import ls from '../../ls';
import '../../ui/editor/editorView';

@customElement('m-compose-app')
export default class MComposeApp extends Element {
  render() {
    return html`
      <div>
        <p class="is-size-4">${ls.newPost}</p>
        <hr />
        <editor-view></editor-view>
      </div>
    `;
  }
}
