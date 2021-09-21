/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import { classMap } from 'lit/directives/class-map.js';

@customElement('container-view')
export class ContainerView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .bs {
          padding-bottom: 2rem;
        }
      `,
    ];
  }

  // No bottom spacing.
  @lp.bool nobs = false;

  render() {
    return html`
      <div
        class=${classMap({
          container: true,
          bs: !this.nobs,
        })}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'container-view': ContainerView;
  }
}
