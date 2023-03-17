/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable class-methods-use-this */
import { BaseElement, customElement, html, property, css } from 'll.js';
import * as pu from 'lib/pageUtil.js';

@customElement('link-button')
/**
 * Style border and padding via `--link` vars to increase touch area on mobile.
 * Style color via `--link-color` (no need to style multiple pseudo classes like visited, hover...)
 */
export class LinkButton extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }

        a,
        a:visited,
        a:hover,
        a:active {
          display: inline-block;
          color: var(--link-color, var(--app-default-primary-fore-color));
          width: 100%;
          padding: var(--link-padding);
          border: var(--link-border);
          border-left: var(--link-border-left, var(--link-border));
          border-right: var(--link-border-right, var(--link-border));
          border-top: var(--link-border-top, var(--link-border));
          border-bottom: var(--link-border-bottom, var(--link-border));
        }

        a:hover {
          opacity: 0.8;
        }

        a:active {
          filter: brightness(80%);
        }
      `,
    ];
  }

  @property() href = '';
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

  // Stop the default behavior of <a> and send it out again.
  private handleClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (this.href) {
      pu.jumpToURL(this.href);
    } else {
      this.dispatchEvent(new CustomEvent('click'));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'link-button': LinkButton;
  }
}
