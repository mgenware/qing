import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import wind from 'app/wind';

@customElement('post-cmt-app')
export class PostCmtApp extends BaseElement {
  postID = '';
  cmtCount = 0;

  firstUpdated() {
    this.postID = wind.postID;
    this.cmtCount = wind.postCmtCount;
  }

  render() {
    return html`
      <cmt-app></cmt-app>
    `;
  }
}
