import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import SetLikeLoader, { LikeHostType } from 'post/loaders/setLikeLoader';
import app from 'app';
import './likeView';
import { CHECK } from 'checks';

@customElement('like-app')
export class LikeApp extends BaseElement {
  @lp.number likes = 0;
  @lp.string hostID = '';
  @lp.bool private isWorking = false;
  @lp.bool private hasLiked = false;

  firstUpdated() {
    CHECK(this.hostID);
  }

  render() {
    return html`
      <like-view
        .isWorking=${this.isWorking}
        .hasLiked=${this.hasLiked}
        @click=${this.handleClick}
      ></like-view>
    `;
  }

  private async handleClick() {
    const loader = new SetLikeLoader(
      this.hostID,
      LikeHostType.post,
      !this.hasLiked,
    );
    const res = await app.runLocalActionAsync(
      loader,
      (s) => (this.isWorking = s.isWorking),
    );

    if (res.error) {
      await app.alert.error(res.error.message);
    } else {
      this.hasLiked = !this.hasLiked;
      this.likes += this.hasLiked ? -1 : 1;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'like-app': LikeApp;
  }
}
