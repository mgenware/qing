import { LitElement } from 'lit-element';
import coreStyles from './app/styles/core';

export default class BaseElement extends LitElement {
  static get styles() {
    return coreStyles;
  }

  protected mustGetShadowRoot(): ShadowRoot {
    if (!this.shadowRoot) {
      throw new Error('shadowRoot null');
    }
    return this.shadowRoot;
  }

  protected getShadowElement<T extends HTMLElement>(id: string): T | null {
    return this.mustGetShadowRoot().getElementById(id) as T | null;
  }

  protected mustGetShadowElement<T extends HTMLElement>(id: string): T {
    const element = this.getShadowElement(id);
    if (!element) {
      throw new Error(`Core DOM element "${id}" missing`);
    }
    return element as T;
  }
}
