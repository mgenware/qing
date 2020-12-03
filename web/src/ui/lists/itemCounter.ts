import { html, customElement, property } from 'lit-element';
import { formatLS, ls } from 'ls';
import BaseElement from 'baseElement';

@customElement('item-counter')
export class ItemCounter extends BaseElement {
  @property({ type: Number }) shown = 0;
  @property({ type: Number }) total = 0;

  render() {
    if (this.total <= 1) {
      return html`
        <span>${ls.oneItem}</span>
      `;
    }
    return html`
      <span>${formatLS(ls.ppItemsCounter, this.shown, this.total)}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'item-counter': ItemCounter;
  }
}
