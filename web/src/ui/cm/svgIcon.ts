import { html, customElement, css } from 'lit-element';
// eslint-disable-next-line import/no-extraneous-dependencies
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import { resizeSVGHTML } from 'lib/htmlLib';
import { AppViewStyleNullable } from './types/appViewStyle';

@customElement('svg-icon')
export class SvgIcon extends BaseElement {
  @lp.string src = '';
  @lp.string iconStyle: AppViewStyleNullable = '';
  @lp.number width = 0;
  @lp.number height = 0;

  @lp.string private svgHTML = '';

  static get styles() {
    // All CSS classes have an `svg-` prefix.
    return [
      super.styles,
      css`
        span {
          fill: var(--fill);
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
      this.svgHTML = resizeSVGHTML(await resp.text(), this.width, this.height);
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
