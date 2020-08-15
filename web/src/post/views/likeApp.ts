import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import SetLikeLoader from 'post/loaders/setLikeLoader';
import app from 'app';
import { listenForVisibilityChange } from 'lib/htmlLib';
import { CHECK } from 'checks';
import './likeView';
import LikeHostType from 'post/loaders/likeHostType';

@customElement('like-app')
export class LikeApp extends BaseElement {
  @lp.number likes = 0;
  @lp.string hostID = '';
  @lp.bool private isWorking = false;
  @lp.bool private hasLiked = false;

  // Starts `get-like` API when the component is first visible.
  @lp.bool loadOnVisible = false;

  firstUpdated() {
    CHECK(this.hostID);

    if (this.loadOnVisible) {
      listenForVisibilityChange([this], this.loadHasLiked);
    } else {
      this.loadHasLiked();
    }
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
    if (!this.isWorking) {
      return;
    }
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

  private loadHasLiked() {
    const loader = new Getlike(this.hostID, LikeHostType.post, !this.hasLiked);
    const res = await app.runLocalActionAsync(
      loader,
      (s) => (this.isWorking = s.isWorking),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'like-app': LikeApp;
  }
}
