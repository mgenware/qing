import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'com/cmt/cmtApp';
import postWind from './postWind';
import 'com/like/likeApp';
import { entityPost } from 'sharedConstants';

// Handles loading of post likes and comments.
@customElement('post-payload-app')
export class PostPayloadApp extends BaseElement {
  private hostID = postWind.EID;
  private cmtCount = postWind.CmtCount;
  private initialLikes = postWind.InitialLikes;

  render() {
    return html`
      <like-app
        .iconSize=${'md'}
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
    'post-payload-app': PostPayloadApp;
  }
}
