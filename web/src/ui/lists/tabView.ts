/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as ll from 'll';

export const tabViewActiveClass = 'tab-active';

@ll.customElement('tab-view')
export class TabView extends ll.BaseElement {
  static get styles() {
    return [
      super.styles,
      ll.css`
        :host {
          display: block;
        }

        .bar {
          overflow-x: auto;
          border-bottom: 1px solid var(--app-default-separator-color);
        }

        ::slotted(a) {
          color: var(--app-default-primary-fore-color);
          display: inline-block;
          font-size: 1.2rem;
          transition: 0.4s;
          padding: 0.8rem 1rem;
        }
        ::slotted(a:visited) {
          color: var(--app-default-primary-fore-color);
        }

        ::slotted(a.tab-active) {
          border-bottom: 3px solid var(--app-default-primary-fore-color);
        }
      `,
    ];
  }

  render() {
    return ll.html`
      <div class="bar">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tab-view': TabView;
  }
}
