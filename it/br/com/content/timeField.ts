/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as brt from 'brt';

function checkTimeString(s: string, edited: boolean) {
  brt.expect(!s.startsWith('today') || !s.startsWith('yesterday')).toBeTruthy();
  const hasEdited = s.includes('[Edited');
  brt.expect(hasEdited).toBe(edited);
}

export async function timeFieldShouldAppear(el: brt.Element, edited: boolean) {
  await el.shouldBeVisible();
  const tsString = await el.c.textContent();
  checkTimeString(tsString || '', edited);
}
