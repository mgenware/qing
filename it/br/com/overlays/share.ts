/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Page } from 'br';
import * as ov from './overlay';

const popupSel = '#__g_share_container share-popup';
const inputSel = '.link-root input';

export async function popupShouldAppear(p: Page, link: string) {
  const sel = ov.openSel(popupSel);
  const el = p.$(sel);
  const textEl = el.$(inputSel);
  await textEl.e.toHaveValue(link);
  await Promise.all([
    el.$qingButton('OK').click(),
    p.c.waitForSelector(sel, { state: 'detached' }),
  ]);
}

export async function getLink(p: Page) {
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
