import { customElement, css, html } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import '../com/centeredView';

@customElement('notice-view')
export class NoticeView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .root-container {
          font-size: 1.6rem;
          color: var(--default-secondary-fore-color);
        }
      `,
    ];
  }

  @lp.string height = '400px';

  render() {
    return html`
      <centered-view class="root-container" height=${this.height}><slot></slot></centered-view>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'notice-view': NoticeView;
  }
}
