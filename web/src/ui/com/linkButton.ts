/* eslint-disable class-methods-use-this */
import { html, customElement } from 'lit-element';
import * as lp from 'lit-props';
import BaseElement from 'baseElement';

@customElement('link-button')
export class LinkButton extends BaseElement {
  @lp.reflected.bool disabled = false;

  render() {
    return html`
      <a href="#" class=${this.disabled ? 'content-disabled' : ''} @click=${this.handleClick}
        ><slot></slot
      ></a>
    `;
  }

  private handleClick(e: Event) {
    e.preventDefault();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'link-button': LinkButton;
  }
}
