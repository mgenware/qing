/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

/* eslint-disable @typescript-eslint/no-use-before-define */

import * as api from '@qing/dev/it/base/api.js';
import * as authRoute from '@qing/routes/dev/auth.js';
import { serverURL } from '@qing/dev/it/base/def.js';
import { Locator, Page, expect } from '@playwright/test';

export { usr, api, type User, authUsr } from '@qing/dev/it/base/api.js';

export type WaitForState = 'attached' | 'detached' | 'visible' | 'hidden';

const mobileViewport = { width: 390, height: 844 };
const desktopViewport = { width: 1280, height: 720 };

export interface PWLocatable {
  locator(selector: string): Locator;
}

// Some shared selector wrappers around `pw.Page` and `pw.Locator`.
class BRLocatable {
  static $(lt: PWLocatable, sel: string) {
    return new BRElement(lt.locator(sel).first());
  }

  static $$(lt: PWLocatable, sel: string) {
    return new BRElementCollection(lt.locator(sel));
  }
}

export class BRLocatorCore {
  constructor(public c: Locator) {}

  $(sel: string) {
    return BRLocatable.$(this.c, sel);
  }

  $$(sel: string) {
    return BRLocatable.$$(this.c, sel);
  }
}

export interface Selectable {
  $(sel: string): BRElement;
  $$(sel: string): BRElementCollection;
}

export class BRElementCollection extends BRLocatorCore {
  item(idx: number) {
    if (idx < 0) {
      throw new Error(`Index should not be negative. Got ${idx}`);
    }
    return new BRElement(this.c.nth(idx));
  }

  count() {
    return this.c.count();
  }

  async shouldHaveCount(count: number) {
    await expect(this.c).toHaveCount(count);
    return this;
  }

  async items() {
    const items: BRElement[] = [];
    const count = await this.count();
    for (let i = 0; i < count; i++) {
      items.push(this.item(i));
    }
    return items;
  }

  async forEach(cb: (el: BRElement, idx: number) => Promise<void>) {
    const items = await this.items();
    return Promise.all(items.map(cb));
  }
}

export class BRElement extends BRLocatorCore {
  getAttribute(name: string) {
    return this.c.getAttribute(name);
  }

  waitFor(state: WaitForState) {
    return this.c.waitFor({ state });
  }

  async waitForLitUpdate() {
    await this.c.evaluate(async (el) => {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-type-assertion
      const elAny = el as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { updateComplete } = elAny;
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!updateComplete) {
        throw new Error('updateComplete is not defined');
      }
      await updateComplete;
    });
  }

  waitForVisible() {
    return this.waitFor('visible');
  }

  waitForAttached() {
    return this.waitFor('attached');
  }

  waitForHidden() {
    return this.waitFor('hidden');
  }

  waitForDetached() {
    return this.waitFor('detached');
  }

  click() {
    return this.c.click();
  }

  shouldExist() {
    return expect(this.c).toHaveCount(1);
  }

  shouldNotExist() {
    return expect(this.c).toHaveCount(0);
  }

  shouldHaveAttrOrNot(attr: string, val: string | null | undefined) {
    if (val === null || val === undefined) {
      return this.shouldNotHaveAttr(attr);
    }
    return expect(this.c).toHaveAttribute(attr, val);
  }

  async shouldHaveHTML(html: string) {
    const actual = await this.c.evaluate((el) => (el as HTMLElement).innerHTML);
    return expect(actual).toBe(html);
  }

  async shouldNotHaveAttr(name: string) {
    return expect(await this.c.evaluate((el) => (el as HTMLElement).getAttribute(name))).toBeNull();
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

  $img(e: { size: number; alt: string; src: string; title?: string }) {
    const sel = `img[width="${e.size}"][height="${e.size}"][alt=${JSON.stringify(
      e.alt,
    )}][src=${JSON.stringify(e.src)}]${e.title ? `[title=${JSON.stringify(e.title)}]` : ''}`;
    return this.$(sel);
  }

  $a(e: { href: string; text?: string }) {
    if (e.text) {
      return this.$hasText(`a[href=${JSON.stringify(e.href)}]`, e.text);
    }
    return this.$(`a[href=${JSON.stringify(e.href)}]`);
  }

  $svgIcon(e: { title: string; src: string }) {
    return this.$(`svg-icon[title=${JSON.stringify(e.title)}][src=${JSON.stringify(e.src)}]`);
  }

  $inputView(label: string) {
    return this.$(`input-view[label=${JSON.stringify(label)}]`);
  }

  $checkItem(text: string) {
    return this.$hasText('check-item', text);
  }

  fillInput(value: string) {
    return this.$('input').c.fill(value);
  }

  clearInput() {
    return this.fillInput('');
  }
}

export interface PageGotoOptions {
  mobile?: boolean;
  params?: Record<string, string>;
}

export class BRPage {
  constructor(public c: Page) {}

  get body(): BRElement {
    return this.$('body');
  }

  url() {
    const url = this.c.url();
    if (url.startsWith(serverURL)) {
      return url.substring(serverURL.length);
    }
    return url;
  }

  $(sel: string) {
    return BRLocatable.$(this.c, sel);
  }

  $$(sel: string) {
    return BRLocatable.$$(this.c, sel);
  }

  waitForURL(url: string | RegExp) {
    if (typeof url === 'string') {
      const finalUrl = url === '/' ? serverURL : `${serverURL}${url}`;
      return this.c.waitForURL(finalUrl);
    }
    return this.c.waitForURL(url);
  }

  goto(url: string, user?: api.User | null, opt?: PageGotoOptions) {
    return this.gotoRaw(`${serverURL}${url}`, user, opt);
  }

  async gotoRaw(url: string, user?: api.User | null, opt?: PageGotoOptions) {
    if (opt?.mobile) {
      await this.toMobile();
    }
    if (user) {
      await this.signIn(user);
    }

    let finalUrl = url;
    if (opt?.params) {
      const urlObj = new URL(url);
      for (const [key, value] of Object.entries(opt.params)) {
        urlObj.searchParams.set(key, value);
      }
      finalUrl = urlObj.toString();
    }
    return this.c.goto(finalUrl);
  }

  async shouldBeUser(user: api.User | null) {
    expect(await this.currentUserID()).toBe(user ? user.id : null);
  }

  async shouldNotHaveHScrollBar() {
    const hScrollable = await this.body.c.evaluate((e) => e.clientWidth < e.scrollWidth);
    expect(hScrollable).toBeFalsy();
  }

  toMobile() {
    return this.c.setViewportSize(mobileViewport);
  }

  toDesktop() {
    return this.c.setViewportSize(desktopViewport);
  }

  async reloadWithUser(user: api.User | null) {
    const page = this.c;
    const url = page.url();
    if (user) {
      await this.signIn(user);
    } else {
      await this.signOut();
    }
    await page.goto(url);
  }

  reload() {
    return this.c.reload();
  }

  async signOut() {
    const url = this.c.url();
    await this.c.goto(`${serverURL}${authRoute.out}`);
    this.checkGETAPIResult(await this.c.content());
    await this.c.goto(url);
  }

  private async signIn(user: api.User) {
    // eslint-disable-next-line no-underscore-dangle
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
    return this.c.evaluate(() => (window as any).appPageState.user?.id as string | null);
  }
}

export function $(page: Page) {
  return new BRPage(page);
}
