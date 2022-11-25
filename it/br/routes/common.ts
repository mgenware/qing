/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Response, expect } from '@playwright/test';
import { Page, alternativeLocale } from 'br.js';

// We use this element selector (the "Light theme" button in theme menu) to test if
// language switched successfully.
const localizedElSel = '.theme-group .text';

export async function checkPageLocale(p: Page, idx: number) {
  await p.$('html').e.toHaveAttribute('lang', idx === 0 ? 'en' : alternativeLocale);
  await p.$(localizedElSel).e.toContainText(idx === 0 ? 'Light theme' : '亮色主题');
}

export async function check404(p: Page, resp: Response | null) {
  expect(resp).not.toBeNull();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(resp!.status()).toBe(404);
  await p.body.$hasText('p', 'The resource you requested does not exist.').e.toBeVisible();
}
