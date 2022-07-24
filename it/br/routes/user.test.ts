/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, alternativeLocaleBlock, usr } from 'br';
import * as cm from './common';

alternativeLocaleBlock(() => {
  test('User route - BR lang', async ({ page }) => {
    const p = $(page);
    await p.goto(usr.user.url, null);
    await cm.checkAlternativeLocale(p);
  });
});

test('User route - 404', async ({ page }) => {
  const p = $(page);
  // TODO: migrate to @qing/routes when node16 issue is fixed.
  const resp = await p.goto('/u/__404__', null);
  await cm.check404(p, resp);
});
