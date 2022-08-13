/* eslint-disable @typescript-eslint/no-use-before-define */
/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as pw from '@playwright/test';
import { User } from 'base/api';
import * as authRoute from '@qing/routes/d/dev/auth';
import { serverURL } from 'base/def';
import { expect } from '@playwright/test';

export { expect, Expect, test } from '@playwright/test';
export { usr, api, User, authUsr } from 'base/api';

export type WaitForState = 'attached' | 'detached' | 'visible' | 'hidden';

const mobileViewport = { width: 390, height: 844 };
const desktopViewport = { width: 1280, height: 720 };
// Use to test a non-default language.
export const alternativeLocale = 'zh-Hans';

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

  waitFor(state: WaitForState) {
    return this.c.waitFor({ state });
  }

  waitForVisible() {
    return this.waitFor('visible');
  }

  waitForAttached() {
    return this.waitFor('attached');
  }

  waitForDetached() {
    return this.waitFor('detached');
  }

  click() {
    return this.c.click();
  }

  get e() {
    return pw.expect(this.c);
  }

  shouldExist() {
    return this.e.toHaveCount(1);
  }

  shouldNotExist() {
    return this.e.toHaveCount(0);
  }

  async shouldHaveHTML(html: string) {
    return pw.expect(await this.c.innerHTML()).toBe(html);
  }

  async shouldNotHaveAttr(name: string) {
    return pw.expect(await this.c.evaluate((el) => el.getAttribute(name))).toBeNull();
  }

  $qingButton(text: string) {
    return this.$hasText('qing-button', text);
  }

  $linkButton(text: string) {
    return this.$hasText('link-button', text);
  }

  $aButton(text: string) {
    return this.$hasText('a[href="#"]', text);
  }

  $hasText(sel: string, text: string) {
    return this.$(`${sel}:has-text(${JSON.stringify(text)})`);
  }

  $checkBox(e: { text: string; radio?: boolean }) {
    return this.$hasText('check-box' + (e.radio ? '[radio]' : ''), e.text);
  }

  $img(e: { size: number; alt: string; src: string; title?: string }) {
    const sel = `img[width="${e.size}"][height="${e.size}"][alt=${JSON.stringify(
      e.alt,
    )}][src=${JSON.stringify(e.src)}]${e.title ? `[title=${JSON.stringify(e.title)}]` : ''}`;
    return this.$(sel);
  }

  $a(e: { href: string; text: string }) {
    return this.$hasText(`a[href=${JSON.stringify(e.href)}]`, e.text);
  }

  $inputView(label: string) {
    return this.$(`input-view[label=${JSON.stringify(label)}]`);
  }

  fillInput(value: string) {
    return this.$('input').c.fill(value);
  }
}

export class Page {
  constructor(public c: pw.Page) {}

  get body(): Element {
    return this.$('body');
  }

  $(sel: string) {
    return PWLocatableWrapper.$(this.c, sel);
  }

  $$(sel: string) {
    return PWLocatableWrapper.$$(this.c, sel);
  }

  async goto(url: string, user: User | null, mobile?: boolean) {
    if (mobile) {
      await this.setMobileViewport();
    }
    if (user) {
      await this.signIn(user);
    }
    return this.c.goto(`${serverURL}${url}`);
  }

  async shouldBeUser(user: User | null) {
    expect(await this.currentUserID()).toBe(user ? user.id : null);
  }

  setMobileViewport() {
    return this.c.setViewportSize(mobileViewport);
  }

  setDesktopViewport() {
    return this.c.setViewportSize(desktopViewport);
  }

  // Reloads current page.
  // `user`: undefined -> no change to credentials. null -> visitor.
  async reload(user?: User | null) {
    const page = this.c;
    if (user === undefined) {
      await page.reload();
      return;
    }
    const url = page.url();
    if (user) {
      await this.signIn(user);
    } else {
      await this.signOut();
    }
    await page.goto(url);
  }

  async signOut() {
    const url = this.c.url();
    await this.c.goto(`${serverURL}${authRoute.out}`);
    this.checkGETAPIResult(await this.c.content());
    await this.c.goto(url);
  }

  private async signIn(user: User) {
    await this.c.goto(`${serverURL}${authRoute.in_}/${user.id}`);
    this.checkGETAPIResult(await this.c.content());
  }

  private checkGETAPIResult(html: string) {
    if (!html.includes('>Success<')) {
      throw new Error(`Login failed. Got "${html}"`);
    }
  }

  private currentUserID() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.c.evaluate(() => (window as any).appUserID as string | null);
  }
}

export function $(page: pw.Page) {
  return new Page(page);
}

export function mobileBlock(fn: () => void) {
  pw.test.describe('Mobile block', () => {
    pw.test.use({ viewport: mobileViewport });
    fn();
  });
}

export function alternativeLocaleBlock(fn: () => void) {
  pw.test.describe('Mobile block', () => {
    pw.test.use({ locale: alternativeLocale });
    fn();
  });
}
