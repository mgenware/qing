/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable class-methods-use-this */
import { BaseElement, customElement, html } from 'll';
import * as lp from 'lit-props';

@customElement('link-button')
export class LinkButton extends BaseElement {
  @lp.bool disabled = false;

  render() {
    return html`
      <a href="#" class=${this.disabled ? 'content-disabled' : ''} @click=${this.handleClick}
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
