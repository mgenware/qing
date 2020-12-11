import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';

@customElement('subheading-view')
export class SubheadingView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  render() {
    return html` <h3><slot></slot></h3> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'subheading-view': SubheadingView;
  }
}
