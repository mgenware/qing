/* eslint-disable class-methods-use-this */
import { html, customElement } from 'lit-element';
import BaseElement from 'baseElement';

@customElement('link-button')
export class LinkButton extends BaseElement {
  render() {
    return html` <a href="#" @click=${this.handleClick}><slot></slot></a> `;
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
