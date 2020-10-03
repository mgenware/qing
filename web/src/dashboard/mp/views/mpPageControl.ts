import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';
import 'ui/cm/itemCounter';

@customElement('mp-page-control')
export class MPPageControl extends BaseElement {
  @lp.number shown = 0;
  @lp.number total = 0;

  render() {
    return html`
      <span>
        <item-counter .shown=${this.shown} .total=${this.total}></item-counter>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mp-page-control': MPPageControl;
  }
}
