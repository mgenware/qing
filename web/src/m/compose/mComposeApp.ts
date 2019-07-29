import { html, customElement } from 'lit-element';
import Element from '../../element';
import ls from '../../ls';
import '../../ui/editor/editorView';

@customElement('m-compose-app')
export default class MComposeApp extends Element {
  render() {
    return html`
      <div>
        <p>${ls.newPost}</p>
        <editor-view></editor-view>
      </div>
    `;
  }
}
