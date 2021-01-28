import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';
import * as lp from 'lit-props';
import ls from 'ls';

@customElement('hf-number')
export class HFNumber extends BaseElement {
  private formatter: Intl.NumberFormat;
  @lp.reflected.number value = Number.NaN;

  constructor() {
    super();

    this.formatter = new Intl.NumberFormat(ls._htmlLang, { notation: 'compact' });
  }

  render() {
    const { value, formatter } = this;
    if (Number.isNaN(value)) {
      return '';
    }
    return html` <span> ${formatter.format(value)} </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hf-number': HFNumber;
  }
}
