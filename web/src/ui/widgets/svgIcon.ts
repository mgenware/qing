/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, customElement, css, BaseElement, lp } from 'll';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ERR } from 'checks';
import { AppViewStyleNullable } from '../types/appViewStyle';

function processSVG(svg: string, width: number, height: number): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const element = doc.documentElement;
  element.setAttribute('width', width.toString());
  element.setAttribute('height', height.toString());
  return element.outerHTML;
}

@customElement('svg-icon')
export class SvgIcon extends BaseElement {
  @lp.string oneTimeSrc = '';
  @lp.reflected.string iconStyle: AppViewStyleNullable = '';
  @lp.number width = 0;
  @lp.number height = 0;
  @lp.number size = 0;

  @lp.string private svgHTML = '';

  static get styles() {
    // All CSS classes have an `svg-` prefix.
    return [
      super.styles,
      css`
        svg {
          fill: var(--svg-icon-fill);
        }
      `,
    ];
  }

  async firstUpdated() {
    if (!this.oneTimeSrc) {
      return;
    }
    try {
      const resp = await fetch(this.oneTimeSrc, { method: 'GET' });
      this.svgHTML = processSVG(
        await resp.text(),
        this.width || this.size,
        this.height || this.size,
      );
    } catch (err) {
      ERR(err);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(`Error downloading file "${this.oneTimeSrc}", ${err.message}.`);
    }
  }

  render() {
    const { svgHTML } = this;
    return html`
      <span style="vertical-align: middle"> ${svgHTML ? unsafeHTML(svgHTML) : ''} </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'svg-icon': SvgIcon;
  }
}
