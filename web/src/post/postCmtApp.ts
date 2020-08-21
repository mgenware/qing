import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import wind from 'app/wind';
import { EntityType } from 'lib/entity';
import './views/likeApp';

@customElement('post-cmt-app')
export class PostCmtApp extends BaseElement {
  private hostID = wind.postID;
  private cmtCount = wind.postCmtCount;
  private initialLikes = wind.appPostInitialLikes;

  render() {
    return html`
      <like-app
        .initialLikes=${this.initialLikes}
        .hostID=${this.hostID}
        .hostType=${EntityType.post}
      ></like-app>
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
