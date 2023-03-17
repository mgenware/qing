/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property, styleMap } from 'll.js';

@customElement('checkmark-view')
// Mobile friendly version of check-box.
export class CheckmarkView extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .checkmark {
          display: inline-block;
          width: 22px;
          height: 22px;
          transform: rotate(45deg);
        }

        .checkmark_circle {
          position: absolute;
          width: 22px;
          height: 22px;
          background-color: var(--app-default-primary-fore-color);
          border-radius: 11px;
          left: 0;
          top: 0;
        }

        .checkmark_stem {
          position: absolute;
          width: 3px;
          height: 9px;
          background-color: var(--app-default-back-color);
          left: 11px;
          top: 6px;
        }

        .checkmark_kick {
          position: absolute;
          width: 3px;
          height: 3px;
          background-color: var(--app-default-back-color);
          left: 8px;
          top: 12px;
        }

        qing-button {
          display: block;
        }

        .content {
          display: grid;
          grid-template-columns: auto 1fr;
          grid-gap: 1rem;
          align-items: center;
          justify-items: start;
        }
      `,
    ];
  }

  @property({ type: Boolean, reflect: true }) checked = false;

  override render() {
    return html`
      <qing-button class="icon" @click=${() => this.dispatchEvent(new CustomEvent('click'))}>
        <div class="content">
          <span
            class="checkmark"
            style=${styleMap({ visibility: this.checked ? 'visible' : 'hidden' })}>
            <div class="checkmark_circle"></div>
            <div class="checkmark_stem"></div>
            <div class="checkmark_kick"></div>
          </span>
          <slot></slot>
        </div>
      </qing-button>
    `;
  }
}

@customElement('checkmark-list')
export class CheckmarkList extends BaseElement {
  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root {
          border: 1px solid var(--app-default-separator-color);
          border-radius: var(--app-surface-radius-sm);
        }

        ::slotted(checkmark-view:not(:first-child)) {
          border-top: 1px solid var(--app-default-separator-color);
        }
      `,
    ];
  }

  override render() {
    return html`<div class="root">
      <slot></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'checkmark-view': CheckmarkView;
    'checkmark-list': CheckmarkList;
  }
}
