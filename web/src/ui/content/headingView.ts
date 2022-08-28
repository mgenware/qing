/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';

@customElement('heading-view')
export class HeadingView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        h2 {
          border-left: var(--app-heading-indicator-width-md) solid
            var(--app-default-primary-fore-color);
          padding-left: 0.4rem;
        }

        @media (min-width: 768px) {
          h2 {
            padding-left: 0.8rem;
          }
        }

        .root {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .root {
            grid-template-columns: 1fr auto;
          }
        }
      `,
    ];
  }

  override render() {
    return html` <div class="root">
      <h2><slot></slot></h2>
      <slot name="decorator"></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'heading-view': HeadingView;
  }
}
