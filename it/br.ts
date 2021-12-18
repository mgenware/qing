/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as pw from '@playwright/test';
import { User } from 'base/call';
import urls, { serverURL } from 'base/urls';

// Re-exports.
export { usr, call } from 'base/call';

export interface HandlerArg {
  page: pw.Page;
  expect: pw.Expect;
  goto: (url: string, user: User | null) => Promise<void>;
}

export type HandlerType = (e: HandlerArg) => Promise<void>;

function newHandlerArg(page: pw.Page): HandlerArg {
  return {
    page,
    expect: pw.expect,
    goto: async (url: string, user: User | null) => {
      if (user) {
        // Playwright has to use the GET version of the login API route.
        await page.goto(`${serverURL}${urls.auth.in_get}/${user.id}`);
      }
      await page.goto(`${serverURL}${url}`, { waitUntil: 'load' });
    },
  };
}

export function test(name: string, handler: HandlerType) {
  return pw.test(name, ({ page }) => handler(newHandlerArg(page)));
}
