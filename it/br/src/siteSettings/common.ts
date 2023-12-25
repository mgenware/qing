/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BRPage } from 'br.js';

export const settingsViewSel = 'site-st-view';
export const lPaneSel = '.br-lpane';
export const rPaneSel = '.br-rpane';

export async function clickSettingsPage(p: BRPage, text: string) {
  const rootEl = p.$(settingsViewSel);
  await rootEl.$(lPaneSel).$linkButton(text).click();
  return rootEl;
}
