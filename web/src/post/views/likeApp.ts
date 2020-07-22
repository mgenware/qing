import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import SetLikeLoader from 'post/loaders/setLikeLoader';
import app from 'app';
import './likeView';

@customElement('like-app')
export class LikeApp extends BaseElement {
  @lp.number likes = 0;
  @lp.string hostID = '';
  @lp.bool private isWorking = false;
  @lp.bool private hasLiked = false;

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
    const loader = new SetLikeLoader(this.hostID, !this.hasLiked);
    const res = await app.runLocalActionAsync(
      loader,
      (s) => (this.isWorking = s.isWorking),
    );
    if (res.isSuccess) {
      this.hasLiked = !this.hasLiked;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'like-app': LikeApp;
  }
}
