import { html, customElement, css } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import { resizeSVGHTML } from 'lib/htmlLib';

@customElement('svg-icon')
export class SvgIcon extends BaseElement {
  @lp.string src = '';
  @lp.string iconClass = '';
  @lp.number width = 0;
  @lp.number height = 0;
  @lp.string private svgHTML = '';

  static get styles() {
    // All CSS classes have an `svg-` prefix.
    return [
      super.styles,
      css`
        .svg-is-success svg {
          fill: var(--success-back-color);
        }

        .svg-is-danger svg {
          fill: var(--danger-back-color);
        }

        .svg-is-primary svg {
          fill: var(--primary-back-color);
        }

        .svg-is-warning svg {
          fill: var(--warning-back-color);
        }

        .svg-is-secondary svg {
          fill: var(--default-secondary-fore-color);
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
      <span class=${`svg-${this.iconClass}`} style="vertical-align: middle">
        ${svgHTML ? unsafeHTML(svgHTML) : ''}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'svg-icon': SvgIcon;
  }
}
