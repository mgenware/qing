import { html, customElement, property } from 'lit-element';
import { format } from 'ls';
import BaseElement from 'baseElement';

@customElement('item-counter')
export class ItemCounter extends BaseElement {
  @property({ type: Number }) shown = 0;
  @property({ type: Number }) total = 0;

  render() {
    return html`
      <span>${format('ppItemCounter', this.shown, this.total)}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'item-counter': ItemCounter;
  }
}
