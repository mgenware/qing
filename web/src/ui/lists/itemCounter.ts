import { html, customElement } from 'lit-element';
import { formatLS, ls } from 'ls';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';

@customElement('item-counter')
export class ItemCounter extends BaseElement {
  @lp.number shown = 0;
  @lp.number total = 0;

  render() {
    if (this.total <= 1) {
      return html` <span>${ls.oneItem}</span> `;
    }
    return html` <span>${formatLS(ls.ppItemsCounter, this.shown, this.total)}</span> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'item-counter': ItemCounter;
  }
}
