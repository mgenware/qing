/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';
// eslint-disable-next-line import/no-extraneous-dependencies
import { classMap } from 'lit-html/directives/class-map';
import * as lp from 'lit-props';

@customElement('container-view')
export class ContainerView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .with-margin {
          padding-top: 1rem;
          padding-bottom: 1.2rem;
          margin-bottom: 1.2rem;
        }
      `,
    ];
  }

  // If true, no extra spacing on top and bottom edges.
  @lp.bool slim = false;

  render() {
    // The `container` is from bootstrap grid styles.
    return html`
      <div
        class=${classMap({
          container: true,
          'with-margin': !this.slim,
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
