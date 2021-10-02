/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';
import { classMap } from 'lit/directives/class-map.js';

@ll.customElement('container-view')
export class ContainerView extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
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
  @ll.bool nobs = false;

  render() {
    return ll.html`
      <div
        class=${classMap({
          container: true,
          bs: !this.nobs,
        })}>
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
