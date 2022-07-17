/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable class-methods-use-this */
import { BaseElement, customElement, html, property } from 'll';

@customElement('link-button')
export class LinkButton extends BaseElement {
  @property({ type: Boolean }) disabled = false;

  override render() {
    return html`
      <a
        href="#"
        part="a"
        class=${this.disabled ? 'content-disabled' : ''}
        @click=${this.handleClick}
        ><slot></slot
      ></a>
    `;
  }

  private handleClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('click'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'link-button': LinkButton;
  }
}
