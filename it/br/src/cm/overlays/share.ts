/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BRPage } from 'br.js';
import * as ov from './overlay.js';
import { expect } from '@playwright/test';

const popupSel = '#__g_share_container share-popup';
const inputSel = '.link-root input';

export async function popupShouldAppear(p: BRPage, link: string) {
  const sel = ov.openSel(popupSel);
  const el = p.$(sel);
  const textEl = el.$(inputSel);
  await expect(textEl.c).toHaveValue(link);
  await Promise.all([
    el.$qingButton('OK').click(),
    p.c.waitForSelector(sel, { state: 'detached' }),
  ]);
}

export async function getLink(p: BRPage) {
  const sel = ov.openSel(popupSel);
  const el = p.$(sel);
  const textEl = el.$(inputSel);
  const val = await textEl.c.inputValue();
  await Promise.all([
    el.$qingButton('OK').click(),
    p.c.waitForSelector(sel, { state: 'detached' }),
  ]);
  return val;
}
