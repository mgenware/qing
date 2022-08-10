/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { parse } from 'node-html-parser';

const mainElSel = 'main';

// Extracts main content element from page HTML.
export function getMainContentHTML(page: string) {
  const root = parse(page);
  const mainEl = root.querySelector(mainElSel);
  return (mainEl?.innerHTML ?? '').trim();
}

export function getMainContentElement(page: string) {
  const root = parse(page);
  return root.querySelector(mainElSel);
}
