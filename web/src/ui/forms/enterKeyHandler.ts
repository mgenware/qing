/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css } from 'll.js';

@customElement('enter-key-handler')
export class EnterKeyHandler extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  override render() {
    return html`
      <div @keyup=${this.handleKeyUp}>
        <slot></slot>
      </div>
    `;
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (e.key !== 'Enter') {
      return;
    }
    const responder = this.querySelector<HTMLElement>('.enter-key-responder');
    if (responder) {
      responder.click();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'enter-key-handler': EnterKeyHandler;
  }
}
