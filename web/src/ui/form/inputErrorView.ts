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
          padding: 0.25rem 0.5rem;
          color: var(--app-default-danger-fore-color);
          border-radius: 4px;
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
