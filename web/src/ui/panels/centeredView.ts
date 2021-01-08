import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
// eslint-disable-next-line import/no-extraneous-dependencies
import { styleMap } from 'lit-html/directives/style-map';

// A view that centers its content horizontally and vertically.
@customElement('centered-view')
export class CenteredView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `,
    ];
  }

  @lp.string height = '';
  @lp.string width = '';

  render() {
    const { height, width } = this;
    return html`
      <div class="root" style=${styleMap({ height, width })}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'centered-view': CenteredView;
  }
}
