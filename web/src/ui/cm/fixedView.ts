import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';

@customElement('fixed-view')
export class FixedView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .centered {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `,
    ];
  }
  @lp.string height = '';

  render() {
    const { height } = this;
    return html`
      <div class="centered" style=${height ? `height: ${height}` : ''}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fixed-view': FixedView;
  }
}
