/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Page } from 'br.js';

export const settingsViewSel = 'm-settings';
export const lPaneSel = '.br-lpane';
export const rPaneSel = '.br-rpane';

export async function clickSettingsPage(p: Page, text: string) {
  const rootEl = p.$(settingsViewSel);
  await rootEl.$(lPaneSel).$linkButton(text).click();
  return rootEl;
}
