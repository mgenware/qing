/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import { staticMainImage } from 'urls';
// eslint-disable-next-line import/no-extraneous-dependencies
import { cache } from 'lit-html/directives/cache';
import { tif } from 'lib/htmlLib';

const defaultIconSize = 30;

@customElement('like-view')
export class LikeView extends BaseElement {
  static get styles() {
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
          padding: 0;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
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

  @lp.number likes = 0;
  @lp.bool isWorking = false;
  @lp.bool hasLiked = false;
  @lp.number iconSize = defaultIconSize;

  render() {
    const { iconSize } = this;
    return html`
      <qing-button disableSelectedStyle ?disabled=${this.isWorking} @click=${this.handleClick}>
        ${cache(
          this.hasLiked
            ? html` <svg-icon
                class="liked"
                .oneTimeSrc=${staticMainImage('heart-filled.svg')}
                .size=${iconSize}
              ></svg-icon>`
            : html` <svg-icon
                class="not-liked"
                .oneTimeSrc=${staticMainImage('heart.svg')}
                .size=${iconSize}
              ></svg-icon>`,
        )}
        ${tif(this.likes, html`<span class="num">${this.likes}</span>`)}
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
