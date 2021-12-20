/* eslint-disable @typescript-eslint/no-use-before-define */
/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as pw from '@playwright/test';

// `expect` has to be patched to handle wrappers like `Element` and `ElementCollection`.
export { expect as pwExpect, Expect, test as pwTest } from '@playwright/test';

export type WaitForState = 'attached' | 'detached' | 'visible' | 'hidden';

function mustGetHTMLElement(e: HTMLElement | SVGElement): HTMLElement {
  if (e instanceof HTMLElement) {
    return e;
  }
  throw new Error(`Element is not an HTML element. Got ${e}`);
}

export class LocatorCore {
  constructor(public c: pw.Locator, public expect: pw.Expect) {}

  $(sel: string) {
    return new Element(this.c.locator(sel).first(), this.expect);
  }

  $$(sel: string) {
    return new ElementCollection(this.c.locator(sel), this.expect);
  }
}

export class ElementCollection extends LocatorCore {
  item(idx: number) {
    if (idx < 0) {
      throw new Error(`Index should not be negative. Got ${idx}`);
    }
    return new Element(this.c.nth(idx), this.expect);
  }

  count() {
    return this.c.count();
  }

  async shouldHaveCount(count: number) {
    await this.expect(this.c).toHaveCount(count);
    return this;
  }

  async items() {
    const items: Element[] = [];
    const count = await this.count();
    for (let i = 0; i < count; i++) {
      items.push(this.item(i));
    }
    return items;
  }
}

export class Element extends LocatorCore {
  getAttribute(name: string) {
    return this.c.getAttribute(name);
  }

  evaluate<R>(
    pageFunction: (el: HTMLElement) => R,
    options?: {
      timeout?: number;
    },
  ): Promise<R> {
    return this.c.evaluate((innerEl) => pageFunction(mustGetHTMLElement(innerEl)), null, options);
  }

  textContent() {
    return this.c.textContent();
  }

  fill(val: string) {
    return this.c.fill(val);
  }

  click() {
    return this.c.click();
  }

  innerHTML() {
    return this.c.innerHTML();
  }

  innerText() {
    return this.c.innerText();
  }

  waitFor(state: WaitForState) {
    return this.c.waitFor({ state });
  }

  async waitForVisible() {
    await this.waitFor('visible');
    return this;
  }

  async waitForAttached() {
    await this.waitFor('attached');
    return this;
  }

  waitForDetached() {
    return this.waitFor('detached');
  }

  async shouldExist() {
    await this.expect(this.c).toHaveCount(1);
    return this;
  }

  async shouldBeVisible() {
    await this.expect(this.c).toBeVisible();
    return this;
  }

  async shouldNotExist() {
    await this.expect(this.c).toHaveCount(0);
  }

  async shouldHaveAttr(name: string, value: string) {
    await this.expect(this.c).toHaveAttribute(name, value);
  }

  async shouldNotHaveAttr(name: string, value: string) {
    await this.expect(this.c).not.toHaveAttribute(name, value);
  }

  async shouldHaveTextContent(val: string) {
    this.expect((await this.c.textContent())?.trim()).toBe(val);
  }

  async shouldHaveHTMLContent(val: string) {
    this.expect((await this.c.innerHTML()).trim()).toBe(val);
  }

  shouldHaveFocus() {
    return this.expect(this.c).toBeFocused();
  }
}

export class Page {
  constructor(public c: pw.Page, public expect: pw.Expect) {}

  $(sel: string) {
    return new Element(this.c.locator(sel).first(), this.expect);
  }

  $$(sel: string) {
    return this.c.locator(sel);
  }

  goto(url: string) {
    return this.c.goto(url);
  }
}
