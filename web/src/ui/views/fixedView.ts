import { html, customElement, property, LitElement, css } from 'lit-element';

@customElement('fixed-view')
export class FixedView extends LitElement {
  static get styles() {
    return css`
      .centered {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;
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
