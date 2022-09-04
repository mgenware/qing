/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll';

export const linkListActiveClass = 'link-active';
export const linkListActiveFilledClass = 'link-active-filled';

@customElement('link-list-view')
export class LinkListView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        ::slotted(link-button) {
          --link-color: var(--app-default-primary-fore-color);
          display: block;
          --link-padding: 0.5rem 0.8rem;
          --link-border-left: var(--app-heading-indicator-width-sm) solid transparent;
        }

        ::slotted(link-button.link-active) {
          --link-border-left: var(--app-heading-indicator-width-sm) solid
            var(--app-default-primary-fore-color);
        }

        ::slotted(link-button.link-active-filled) {
          --link-color: var(--app-primary-fore-color) !important;
          background-color: var(--app-primary-back-color);
        }
      `,
    ];
  }

  override render() {
    return html`
      <div class="menu">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'link-list-view': LinkListView;
  }
}
