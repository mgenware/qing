import { customElement, css, html } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import 'qing-dock-box';

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
          color: var(--app-default-secondary-fore-color);
        }
      `,
    ];
  }

  @lp.string height = '400px';

  render() {
    return html`
      <qing-dock-box class="root-container" style=${`height:${this.height}`}
        ><slot></slot
      ></qing-dock-box>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'notice-view': NoticeView;
  }
}
