import { html, customElement, property, css } from 'lit-element';
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
  @property() height = '';

  render() {
    const { height } = this;
    return html`
      <div class="centered" style=${height ? `height: ${height}` : ''}>
        <slot></slot>
      </div>
    `;
  }
}
