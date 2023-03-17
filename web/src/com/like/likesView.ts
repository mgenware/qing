/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, when, property } from 'll.js';
import { staticMainImage } from 'urls.js';
import { cache } from 'lit/directives/cache.js';

const defaultIconSize = 30;

@customElement('likes-view')
export class LikesView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }

        qing-button::part(button) {
          /** The content lies inside qing-button. This is the only way to set the default text color. */
          color: var(--app-default-secondary-fore-color);
          background-color: transparent;
          border: 0;
          padding: 0.2rem;
        }

        .num {
          margin-left: 0.25rem;
          padding-right: 1rem;
        }

        svg-icon.not-liked {
          --svg-icon-fill: var(--app-default-secondary-fore-color);
        }

        svg-icon.liked {
          --svg-icon-fill: var(--app-heart-color);
        }
      `,
    ];
  }

  @property({ type: Number }) likes = 0;
  @property({ type: Boolean }) isWorking = false;
  @property({ type: Boolean }) hasLiked = false;
  @property({ type: Number }) iconSize = defaultIconSize;

  override render() {
    const { iconSize } = this;
    return html`
      <qing-button disableSelectedStyle ?disabled=${this.isWorking} @click=${this.handleClick}>
        ${cache(
          this.hasLiked
            ? html`<svg-icon
                class="liked"
                .src=${staticMainImage('heart-filled.svg')}
                .size=${iconSize}></svg-icon>`
            : html`<svg-icon
                class="not-liked"
                .src=${staticMainImage('heart.svg')}
                .size=${iconSize}></svg-icon>`,
        )}
        ${when(this.likes, () => html`<span class="num">${this.likes}</span>`)}
      </qing-button>
    `;
  }

  private handleClick() {
    this.dispatchEvent(new CustomEvent<undefined>('likes-view-click'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'likes-view': LikesView;
  }
}
