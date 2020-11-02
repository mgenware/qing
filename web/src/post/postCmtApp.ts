import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import postWind from './postWind';
import './views/likeApp';
import { entityPost } from 'sharedConstants';

@customElement('post-cmt-app')
export class PostCmtApp extends BaseElement {
  private hostID = postWind.appPostID;
  private cmtCount = postWind.appPostCmtCount;
  private initialLikes = postWind.appPostInitialLikes;

  render() {
    return html`
      <like-app
        .initialLikes=${this.initialLikes}
        .hostID=${this.hostID}
        .hostType=${entityPost}
      ></like-app>
      <cmt-app
        .hostID=${this.hostID}
        .hostType=${entityPost}
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
