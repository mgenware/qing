import { html, customElement, css } from 'lit-element';
// eslint-disable-next-line import/no-extraneous-dependencies
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
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
  @lp.string src = '';
  @lp.string iconStyle: AppViewStyleNullable = '';
  @lp.number width = 0;
  @lp.number height = 0;
  @lp.number size = 0;

  @lp.string private svgHTML = '';

  static get styles() {
    // All CSS classes have an `svg-` prefix.
    return [
      super.styles,
      css`
        span {
          fill: var(--svg-fill);
        }
      `,
    ];
  }

  async firstUpdated() {
    if (!this.src) {
      return;
    }
    try {
      const resp = await fetch(this.src, { method: 'GET' });
      this.svgHTML = processSVG(
        await resp.text(),
        this.width || this.size,
        this.height || this.size,
      );
    } catch (err) {
      console.error(`Error downloading file "${this.src}", ${err.message}.`);
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
