/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BrowserContext } from '@playwright/test';
import { serverURL } from '@qing/dev/it/base/def.js';

export default class PWCookies {
  static async setCookieAsync(context: BrowserContext, key: string, value: string) {
    await context.addCookies([{ name: key, value: encodeURIComponent(value), url: serverURL }]);
  }
}
