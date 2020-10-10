import { html, customElement, css } from 'lit-element';
import BaseElement from 'baseElement';

@customElement('container-view')
export class ContainerView extends BaseElement {
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
    // The `container` is from bootstrap grid styles.
    return html` <div class="container"><slot></slot></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'container-view': ContainerView;
  }
}
