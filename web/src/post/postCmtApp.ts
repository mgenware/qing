import { html, customElement, property } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';

@customElement('post-cmt-app')
export class PostCmtApp extends BaseElement {
  @property() targetID = '';
  @property() targetUserID = '';

  render() {
    return html`
      <cmt-app></cmt-app>
    `;
  }
}
