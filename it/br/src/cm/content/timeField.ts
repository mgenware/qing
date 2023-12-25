/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';
import { expect } from '@playwright/test';

function checkTimeString(s: string, edited: boolean) {
  expect(!s.startsWith('today') || !s.startsWith('yesterday')).toBeTruthy();
  const hasEdited = s.includes('Edited');
  expect(hasEdited).toBe(edited);
}

export async function shouldAppear(el: br.BRElement, edited: boolean) {
  await expect(el.c).toBeVisible();
  if (edited) {
    await el.waitForLitUpdate();
    await el.$hasText('span', 'Edited').waitForVisible();
  }
  const tsString = await el.$('span').c.textContent();
  checkTimeString(tsString || '', edited);
}
