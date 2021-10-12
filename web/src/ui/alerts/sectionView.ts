/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import { AppViewStyleNullable } from 'ui/types/appViewStyle';

@customElement('section-view')
export class SectionView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .section-header {
          padding: 0.75rem 1rem;
          color: var(--header-color);
          background-color: var(--tint-color);
          border-radius: var(--border-radius);
        }

        .section-content {
          padding: 0.75rem 1rem;
          color: var(--content-color);
        }

        @media (min-width: 768px) {
          .section-header {
            border-radius: var(--border-radius) var(--border-radius) 0 0;
          }

          .section-content {
            border-width: 0 1px 1px 1px;
            border-radius: 0 0 var(--border-radius) var(--border-radius);
            border-color: var(--tint-color);
            border-style: solid;
          }
        }
      `,
    ];
  }

  @lp.string sectionStyle: AppViewStyleNullable = '';

  render() {
    return html`
      <div class="section-container">
        <div class="section-header">
          <slot name="header"></slot>
        </div>
        <div class="section-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'section-view': SectionView;
  }
}
