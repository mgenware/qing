/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement, customElement, html, css, property, state, styleMap } from 'll.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ERR } from 'checks.js';
import { AppViewStyleNullable } from '../types/appViewStyle.js';

function processSVG(svg: string, _width: number, _height: number): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const element = doc.documentElement;
  element.setAttribute(
    'viewBox',
    `0 0 ${element.getAttribute('width')} ${element.getAttribute('height')}`,
  );
  return element.outerHTML;
}

@customElement('svg-icon')
export class SvgIcon extends BaseElement {
  @property() src = '';
  @property() iconStyle: AppViewStyleNullable = '';
  @property({ type: Number }) width = 0;
  @property({ type: Number }) height = 0;
  @property({ type: Number }) size = 0;

  @state() _svgHTML = '';

  static override get styles() {
    // All CSS classes have an `svg-` prefix.
    return [
      super.styles,
      css`
        .root {
          display: inline-block;
          vertical-align: middle;
        }

        .root svg {
          width: 100%;
          height: auto;
        }

        :host div {
          color: var(--svg-color, --app-default-secondary-fore-color);
        }
        :host([iconStyle='success']) div {
          color: var(--app-default-success-fore-color);
        }
        :host([iconStyle='danger']) div {
          color: var(--app-default-danger-fore-color);
        }
        :host([iconStyle='primary']) div {
          color: var(--app-default-primary-fore-color);
        }
        :host([iconStyle='warning']) div {
          color: var(--app-default-warning-fore-color);
        }
      `,
    ];
  }

  override render() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _svgHTML } = this;
    return html`<div
      class="root"
      style=${styleMap({
        width: `${this.width || this.size}px`,
        height: `${this.height || this.size}px`,
      })}>
      ${_svgHTML ? unsafeHTML(_svgHTML) : ''}
    </div>`;
  }

  override async willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('src') && this.src) {
      try {
        const resp = await fetch(this.src, { method: 'GET' });
        this._svgHTML = processSVG(
          await resp.text(),
          this.width || this.size,
          this.height || this.size,
        );
      } catch (err) {
        ERR(err);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.error(`Error downloading file "${this.src}", ${err.message}.`);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'svg-icon': SvgIcon;
  }
}
