import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import SetLikeLoader from 'post/loaders/setLikeLoader';
import app from 'app';
import { listenForVisibilityChange } from 'lib/htmlLib';
import { CHECK } from 'checks';
import './likeView';
import LikeHostType from 'post/loaders/likeHostType';
import GetLikeLoader from 'post/loaders/getLikeLoader';

@customElement('like-app')
export class LikeApp extends BaseElement {
  @lp.string hostID = '';
  @lp.string hostType: LikeHostType = 0;
  @lp.number initialLikes = 0;
  @lp.number private likes = 0;
  @lp.bool private isWorking = false;
  @lp.bool private hasLiked = false;

  // Starts `get-like` API when the component is first visible.
  @lp.bool loadOnVisible = false;

  firstUpdated() {
    CHECK(this.hostID);
    CHECK(this.hostType);

    this.likes = this.initialLikes;
    if (this.loadOnVisible) {
      listenForVisibilityChange([this], () => this.loadHasLiked);
    } else {
      this.loadHasLiked();
    }
  }

  render() {
    return html`
      <like-view
        .isWorking=${this.isWorking}
        .hasLiked=${this.hasLiked}
        .likes=${this.likes}
        @click=${this.handleClick}
      ></like-view>
    `;
  }

  private async handleClick() {
    if (this.isWorking) {
      return;
    }
    const loader = new SetLikeLoader(
      this.hostID,
      this.hostType,
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
      this.likes += this.hasLiked ? 1 : -1;
    }
  }

  private async loadHasLiked() {
    const loader = new GetLikeLoader(this.hostID, this.hostType);
    const res = await app.runLocalActionAsync(
      loader,
      (s) => (this.isWorking = s.isWorking),
    );
    if (res.error) {
      await app.alert.error(res.error.message);
    } else {
      this.hasLiked = res.data || false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'like-app': LikeApp;
  }
}
