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

function mustGetHTMLElement(e: HTMLElement | SVGElement): HTMLElement {
  if (e instanceof HTMLElement) {
    return e;
  }
  throw new Error(`Element is not an HTML element. Got ${e}`);
}

export class LocatorCore {
  constructor(public c: pw.Locator) {}

  $(sel: string) {
    return new Element(this.c.locator(sel).first());
  }

  $$(sel: string) {
    return new ElementCollection(this.c.locator(sel));
  }
}

export class ElementCollection extends LocatorCore {
  item(idx: number) {
    return new Element(this.c.nth(idx));
  }

  get count() {
    return this.c.count();
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
}

export class Page {
  constructor(public c: pw.Page) {}

  $(sel: string) {
    return new Element(this.c.locator(sel).first());
  }

  $$(sel: string) {
    return this.c.locator(sel);
  }

  goto(url: string) {
    return this.c.goto(url);
  }

  content() {
    return this.c.content();
  }
}
