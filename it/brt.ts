/* eslint-disable @typescript-eslint/no-use-before-define */
/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as pw from '@playwright/test';
import { User } from 'base/call';
import { auth, serverURL } from 'base/urls';

export { expect, Expect, test } from '@playwright/test';

export type WaitForState = 'attached' | 'detached' | 'visible' | 'hidden';

function mustGetHTMLElement(e: HTMLElement | SVGElement): HTMLElement {
  if (e instanceof HTMLElement) {
    return e;
  }
  throw new Error(`Element is not an HTML element. Got ${e}`);
}

export interface PWLocatable {
  locator(selector: string): pw.Locator;
}

// Some shared selector wrappers around `pw.Page` and `pw.Locator`.
class PWLocatableWrapper {
  static $(lt: PWLocatable, sel: string) {
    return new Element(lt.locator(sel).first());
  }

  static $$(lt: PWLocatable, sel: string) {
    return new ElementCollection(lt.locator(sel));
  }
}

export class LocatorCore {
  constructor(public c: pw.Locator) {}

  $(sel: string) {
    return PWLocatableWrapper.$(this.c, sel);
  }

  $$(sel: string) {
    return PWLocatableWrapper.$$(this.c, sel);
  }
}

export interface Selectable {
  $(sel: string): Element;
  $$(sel: string): ElementCollection;
}

export class ElementCollection extends LocatorCore {
  item(idx: number) {
    if (idx < 0) {
      throw new Error(`Index should not be negative. Got ${idx}`);
    }
    return new Element(this.c.nth(idx));
  }

  count() {
    return this.c.count();
  }

  async shouldHaveCount(count: number) {
    await pw.expect(this.c).toHaveCount(count);
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
    await pw.expect(this.c).toHaveCount(1);
    return this;
  }

  async shouldBeVisible() {
    await pw.expect(this.c).toBeVisible();
    return this;
  }

  async shouldNotExist() {
    await pw.expect(this.c).toHaveCount(0);
  }

  async shouldHaveAttr(name: string, value: string) {
    await pw.expect(this.c).toHaveAttribute(name, value);
  }

  async shouldHaveClass(name: string) {
    await pw.expect(this.c).toHaveClass(name);
  }

  async shouldNotHaveClass(name: string) {
    await pw.expect(this.c).not.toHaveClass(name);
  }

  async shouldNotHaveAttr(name: string, value: string) {
    await pw.expect(this.c).not.toHaveAttribute(name, value);
  }

  async shouldHaveTextContent(val: string) {
    pw.expect(this.c).toHaveText(val);
  }

  async shouldHaveHTMLContent(val: string) {
    pw.expect(this.c).not.toHaveText(val);
  }

  shouldHaveFocus() {
    return pw.expect(this.c).toBeFocused();
  }

  shouldHaveValue(val: string) {
    return this.shouldHaveAttr('value', val);
  }

  $qingButton(text: string) {
    return this.$(`qing-button:has-text("${text}")`);
  }

  $linkButton(text: string) {
    return this.$(`a:has-text("${text}")`);
  }
}

export class Page {
  constructor(public c: pw.Page) {}

  $(sel: string) {
    return PWLocatableWrapper.$(this.c, sel);
  }

  $$(sel: string) {
    return PWLocatableWrapper.$$(this.c, sel);
  }

  async goto(url: string, user: User | null) {
    if (user) {
      await this.signIn(user);
    }
    await this.c.goto(`${serverURL}${url}`);
  }

  async reload(user: User | null) {
    const page = this.c;
    if (user) {
      await this.signIn(user);
    }
    await page.reload();
  }

  async signOut(page: Page) {
    await page.c.goto(`${serverURL}${auth.out}`);
    this.checkGETAPIResult(await this.c.content());
  }

  private async signIn(user: User) {
    await this.c.goto(`${serverURL}${auth.in}/${user.id}`);
    this.checkGETAPIResult(await this.c.content());
  }

  private checkGETAPIResult(html: string) {
    if (!html.includes('>Success<')) {
      throw new Error(`Login failed. Got "${html}"`);
    }
  }
}

export function $(page: pw.Page) {
  return new Page(page);
}
