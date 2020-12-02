import { customElement, css, html } from 'lit-element';
import BaseElement from 'baseElement';
import '../com/centeredView';
import ls from 'ls';

@customElement('no-content-view')
export class NoContentView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root {
          font-size: 1.6rem;
          color: var(--default-secondary-fore-color);
        }
      `,
    ];
  }

  render() {
    return html`
      <centered-view class="root" height="400px"> ${ls.noContentAvailable} </centered-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'no-content-view': NoContentView;
  }
}
