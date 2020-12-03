import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';

@customElement('input-error-view')
export class InputErrorView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }

        div {
          display: inline-block;
          padding: 5px 8px;
          background-color: var(--danger-back-color);
          color: var(--danger-fore-color);
          border-radius: 4px;
          margin-bottom: 10px;
        }
      `,
    ];
  }

  @lp.string message = '';

  render() {
    const { message } = this;
    if (!message) {
      return html``;
    }
    return html` <div>${message}</div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'input-error-view': InputErrorView;
  }
}
