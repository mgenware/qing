/* eslint-disable class-methods-use-this */
import { html, customElement, css } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'qing-button';
import { staticMainImage } from 'urls';
import 'ui/widgets/svgIcon';

const voteBtnSize = 20;

@customElement('poll-view')
export class PollView extends BaseElement {
  static get styles() {
    return [
      super.styles,
      css`
        .root {
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
        }
      `,
    ];
  }

  @lp.number value = 0;
  @lp.number ups = 0;
  @lp.number downs = 0;

  render() {
    return html`
      <div class="root">
        <qing-button>
          <svg-icon
            iconStyle="success"
            .src=${staticMainImage('plus-sign.svg')}
            .size=${voteBtnSize}
          ></svg-icon>
        </qing-button>
        <div>${this.value}</div>
        <qing-button>
          <svg-icon
            iconStyle="danger"
            .src=${staticMainImage('minus-sign.svg')}
            .size=${voteBtnSize}
          ></svg-icon>
        </qing-button>
        <div>${this.ups} | ${this.downs}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'poll-view': PollView;
  }
}
