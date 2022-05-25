/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';
import * as lp from 'lit-props';
import { AppViewStyleNullable } from 'ui/types/appViewStyle';

@customElement('tag-view')
export class TagView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        .tag {
          padding: 0.1rem 0.3rem;
          margin-left: 0.2rem;
          margin-right: 0.2rem;
          line-height: 1.3;
          border: 1px solid transparent;
          border-radius: 4px;
          color: var(--color);
          background-color: var(--background-color);
        }
      `,
    ];
  }

  @lp.string tagStyle: AppViewStyleNullable = '';

  override render() {
    return html`<span class="tag"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tag-view': TagView;
  }
}
