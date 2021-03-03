import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import { staticMainImage } from 'urls';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cache } from 'lit-html/directives/cache';

const iconSize = 30;
@customElement('like-view')
export class LikeView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        qing-button.root-btn::part(button) {
          background-color: transparent;
          border: 0;
          border-radius: 50%;
          padding: 0;
        }

        svg-icon.liked {
          --svg-icon-fill: var(--app-heart-color);
        }
      `,
    ];
  }

  @lp.number likes = 0;
  @lp.bool isWorking = false;
  @lp.bool hasLiked = false;

  render() {
    return html`
      <qing-button
        class=${`root-btn ${this.hasLiked ? 'selected' : ''}`}
        disableSelectedStyle
        ?disabled=${this.isWorking}
        canSelect
        ?selected=${this.hasLiked}
        @click=${this.handleClick}
      >
        ${cache(
          this.likes
            ? html` <svg-icon
                class="liked"
                .oneTimeSrc=${staticMainImage('heart-filled.svg')}
                .size=${iconSize}
              ></svg-icon>`
            : html` <svg-icon
                .oneTimeSrc=${staticMainImage('heart.svg')}
                .size=${iconSize}
              ></svg-icon>`,
        )}
      </qing-button>
    `;
  }

  private handleClick() {
    this.dispatchEvent(new CustomEvent<undefined>('click'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'like-view': LikeView;
  }
}
