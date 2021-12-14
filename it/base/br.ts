/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import playwright from 'playwright';
import { runTask } from 'base/runner';
import { createContext } from './browserInstance';
import { debugMode } from './debug';
import { User } from 'base/call';
import urls, { serverURL } from './urls';
import globalContext from './globalContext';

// Re-exports.
export * as ass from 'base/ass';
export { usr, call } from 'base/call';

export class Browser {
  constructor(
    public name: string,
    public context: playwright.BrowserContext,
    public page: playwright.Page,
  ) {}

  async goto(url: string, user: User | null) {
    if (user) {
      // Playwright has to use the GET version of the login API route.
      await this.page.goto(`${serverURL}${urls.auth.in_get}/${user.id}`);
    }
    return this.page.goto(`${serverURL}${url}`, { waitUntil: 'load' });
  }

  content() {
    return this.page.content();
  }

  async dispose() {
    return this.context.close();
  }
}

export interface TestOptions {
  name: string;
  queue?: string;
}

export type TestInput = string | TestOptions;

async function newBrowser(name: string): Promise<Browser> {
  const context = await createContext();
  const page = await context.newPage();
  return new Browser(name, context, page);
}

async function runHandler(name: string, handler: (br: Browser) => Promise<void>) {
  const br = await newBrowser(name);
  await handler(br);
  if (!debugMode()) {
    await br.dispose();
  }
}

export async function tmpBrowserPage(handler: (br: Browser) => Promise<void>) {
  const br = await newBrowser('TMP');
  await handler(br);
  await br.dispose();
}

export async function test(input: TestInput, handler: (br: Browser) => Promise<void>) {
  const opts = typeof input === 'string' ? { name: input } : input;
  if (globalContext.nameFilter) {
    if (!opts.name?.includes(globalContext.nameFilter)) {
      return;
    }
  }
  if (!opts.name) {
    throw new Error('Unnamed test');
  }
  if (typeof handler !== 'function') {
    throw new Error(`\`handler\` is not a function, got ${handler}`);
  }

  await runTask(opts.name, () => runHandler(opts.name, handler), opts.queue);
}
