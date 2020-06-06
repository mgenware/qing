import { LitElement } from 'lit-element';
import { InputView } from 'ui/form/inputView';
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

  protected getAllInputViews(): NodeListOf<InputView> {
    return this.mustGetShadowRoot().querySelectorAll('input-view');
  }

  protected checkFormValidity(): boolean {
    const inputs = this.getAllInputViews();

    let valid = true;
    // We must run through all inputs to make sure each `InputView` has `validationMessage` set.
    for (const input of inputs) {
      if (input.checkValidity() === false) {
        valid = false;
      }
    }
    return valid;
  }
}
