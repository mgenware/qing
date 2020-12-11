import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';

@customElement('heading-view')
export class HeadingView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        h2 {
          border-left: 6px solid var(--app-default-primary-fore-color);
          padding-left: 0.4rem;
        }

        @media (min-width: 768px) {
          h2 {
            padding-left: 0.8rem;
          }
        }
      `,
    ];
  }

  render() {
    return html` <h2><slot></slot></h2> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'heading-view': HeadingView;
  }
}
