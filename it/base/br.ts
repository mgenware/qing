/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import puppeteer from 'puppeteer';
import { serverURL } from 'base/urls';
import { runTask } from 'base/runner';
import { createContext } from './browserInstance';

// Re-exports.
export * as ass from 'base/ass';
export { usr, post } from 'base/post';
export class Browser {
  constructor(
    public name: string,
    public context: puppeteer.BrowserContext,
    public page: puppeteer.Page,
  ) {}

  goto(url: string) {
    return this.page.goto(`${serverURL}${url}`);
  }

  content() {
    return this.page.content();
  }

  async dispose() {
    return this.context.close();
  }

  // Make sure `import puppeteer from 'puppeteer'` is used so that
  // we can use the `puppeteer` namespace in JSDoc comments.
  // eslint-disable-next-line class-methods-use-this, no-underscore-dangle
  __dummy() {
    return puppeteer.Browser;
  }
}

export interface TestOptions {
  name: string;
  queue?: string;
}

export type TestInput = string | TestOptions;

async function runHandler(name: string, handler: (br: Browser) => void) {
  const context = await createContext();
  const page = await context.newPage();
  const userBrowser = new Browser(name, context, page);
  await handler(userBrowser);
  await userBrowser.dispose();
}

export async function test(input: TestInput, handler: (br: Browser) => void) {
  const opts = typeof input === 'string' ? { name: input } : input;
  if (!opts.name) {
    throw new Error('Unnamed test');
  }
  if (typeof handler !== 'function') {
    throw new Error(`\`handler\` is not a function, got ${handler}`);
  }

  await runTask(opts.name, () => runHandler(opts.name, handler), opts.queue);
}
