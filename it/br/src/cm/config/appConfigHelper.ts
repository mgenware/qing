/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BrowserContext } from '@playwright/test';
import { appDef } from '@qing/def';
import PWCookies from './pwCookies.js';

export async function updateAppConfig(context: BrowserContext, key: string, value: string) {
  // eslint-disable-next-line no-param-reassign
  key = appDef.brAppConfigCookiePrefix + key;
  await PWCookies.setCookieAsync(context, key, value);
}
