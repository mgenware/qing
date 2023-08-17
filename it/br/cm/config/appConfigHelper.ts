/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { AppConfigSchema } from './appConfigSchema.js';
import { BrowserContext } from '@playwright/test';
import { appDef } from '@qing/def';

export async function setContextAppConfig(context: BrowserContext, config: AppConfigSchema) {
  const appConfigString = JSON.stringify(config);
  await context.addCookies({ name: appDef.appConfigBrCookie, value: appConfigString });
}
