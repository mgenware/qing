/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Response, expect } from '@playwright/test';
import { alternativeLocale } from '@qing/dev/it/base/def.js';
import { BRPage } from 'br.js';
import * as nbm from 'cm/navbar/menu.js';

export async function checkPageLocale(p: BRPage, idx: number) {
  await expect(p.$('html').c).toHaveAttribute('lang', idx === 0 ? 'en' : alternativeLocale);
  const themeDropdownBtn = nbm.themeDropdownBtn(p);
  await expect(themeDropdownBtn.c).toContainText(idx === 0 ? 'Light theme' : '亮色主题');
}

export async function check404(p: BRPage, resp: Response | null) {
  expect(resp).not.toBeNull();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(resp!.status()).toBe(404);
  await expect(p.body.$hasText('p', 'The resource you requested does not exist.').c).toBeVisible();
}
