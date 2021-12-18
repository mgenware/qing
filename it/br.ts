/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';
import { User } from 'base/call';
import urls, { serverURL } from 'base/urls';

// Re-exports.
export { usr, call } from 'base/call';

export interface HandlerArg {
  page: brt.Page;
  expect: brt.Expect;
  goto: (url: string, user: User | null) => Promise<void>;
}

export type HandlerType = (e: HandlerArg) => Promise<void>;

function newHandlerArg(page: brt.Page): HandlerArg {
  return {
    page,
    expect: brt.expect,
    goto: async (url: string, user: User | null) => {
      if (user) {
        // Playwright has to use the GET version of the login API route.
        await page.goto(`${serverURL}${urls.auth.in_get}/${user.id}`);
      }
      await page.goto(`${serverURL}${url}`);
    },
  };
}

export function test(name: string, handler: HandlerType) {
  return brt.pwTest(name, ({ page }) => handler(newHandlerArg(new brt.Page(page))));
}
