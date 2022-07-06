/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';

function checkTimeString(s: string, edited: boolean) {
  br.expect(!s.startsWith('today') || !s.startsWith('yesterday')).toBeTruthy();
  const hasEdited = s.includes('Edited');
  br.expect(hasEdited).toBe(edited);
}

export async function timeFieldShouldAppear(el: br.Element, edited: boolean) {
  await el.e.toBeVisible();
  if (edited) {
    await el.$hasText('small', 'Edited').waitForVisible();
  }
  const tsString = await el.$('small').c.textContent();
  checkTimeString(tsString || '', edited);
}
