/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Response, expect } from '@playwright/test';
import { Page, alternativeLocale } from 'br';

// We use this element selector (the "Light theme" button in theme menu) to test if
// language switched successfully.
const localizedElSel = '.theme-group .text';

export async function checkAlternativeLocale(p: Page) {
  await p.$('html').e.toHaveAttribute('lang', alternativeLocale);
  await p.$(localizedElSel).e.toContainText('亮色主题');
}

export async function check404(p: Page, resp: Response | null) {
  expect(resp).not.toBeNull();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(resp!.status()).toBe(404);
  await p.body.$hasText('p', 'The resource you requested does not exist.').e.toBeVisible();
}
