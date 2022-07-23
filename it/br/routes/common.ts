/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Page } from 'br';

export const newLang = 'zh-Hans';

// We use this element selector (the "Light theme" button in theme menu) to test if
// language switched successfully.
const localizedElSel = '.theme-group .text';

export async function checkNewLang(p: Page) {
  await p.$('html').e.toHaveAttribute('lang', newLang);
  await p.$(localizedElSel).e.toContainText('亮色主题');
}
