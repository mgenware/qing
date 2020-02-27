import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import wind from 'app/wind';
import { EntityType } from 'lib/entity';

@customElement('post-cmt-app')
export class PostCmtApp extends BaseElement {
  hostID = wind.postID;
  cmtCount = wind.postCmtCount;

  render() {
    return html`
      <cmt-app
        .hostID=${this.hostID}
        .hostType=${EntityType.post}
        .initialCount=${this.cmtCount}
      ></cmt-app>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'post-cmt-app': PostCmtApp;
  }
}
