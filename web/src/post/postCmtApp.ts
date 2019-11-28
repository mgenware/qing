import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import 'core/cmt/cmtApp';
import wind from 'app/wind';
import { EntityType } from 'lib/entity';

@customElement('post-cmt-app')
export class PostCmtApp extends BaseElement {
  postID = wind.postID;
  cmtCount = wind.postCmtCount;

  render() {
    return html`
      <cmt-app
        entityID=${this.postID}
        .entityType=${EntityType.post}
        .initialCount=${this.cmtCount}
      ></cmt-app>
    `;
  }
}
