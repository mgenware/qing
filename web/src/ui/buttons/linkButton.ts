/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable class-methods-use-this */
import * as ll from 'll';

@ll.customElement('link-button')
export class LinkButton extends ll.BaseElement {
  @ll.bool disabled = false;

  render() {
    return ll.html`
      <a href="#" class=${this.disabled ? 'content-disabled' : ''} @click=${this.handleClick}
        ><slot></slot
      ></a>
    `;
  }

  private handleClick(e: Event) {
    e.preventDefault();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'link-button': LinkButton;
  }
}
