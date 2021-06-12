/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { CSSResultArray, CSSResultOrNative, LitElement } from 'lit';
import { InputView } from 'ui/form/inputView';
import coreStyles from './app/styles/bundle';

export * from 'lit';
export * as lp from 'lit-props';
export * from 'lit/decorators.js';
export * from 'lit/directives/ref';

export class BaseElement extends LitElement {
  static get styles(): CSSResultOrNative | CSSResultArray {
    return [coreStyles];
  }

  private mustGetShadowRoot(): ShadowRoot {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.shadowRoot) {
      throw new Error('shadowRoot null');
    }
    return this.shadowRoot;
  }

  protected getShadowElement<T extends HTMLElement>(id: string): T | null {
    return this.mustGetShadowRoot().getElementById(id) as T | null;
  }

  protected queryShadowElement<T extends HTMLElement>(sel: string): T | null {
    return this.mustGetShadowRoot().querySelector(sel) ?? null;
  }

  /**
   * Not recommended. Use `getShadowElement` or `queryShadowElement` instead,
   * which don't assume the element always exist. Template elements can be
   * null in the following situations:
   * - A template is not connected.
   * - An element is conditionally rendered.
   *
   * It's always a good practice to handle null cases of DOM elements.
   */
  protected unsafeGetShadowElement<T extends HTMLElement>(id: string): T {
    const res = this.getShadowElement<T>(id);
    if (!res) {
      throw new Error(`Element "${id}" is not found`);
    }
    return res;
  }

  // Not recommended. See `unsafeGetShadowElement`.
  protected unsafeQueryShadowElement<T extends HTMLElement>(sel: string): T {
    const res = this.queryShadowElement<T>(sel);
    if (!res) {
      throw new Error(`No result found in element query "${sel}"`);
    }
    return res;
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
