/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { parse } from 'node-html-parser';

const mainElSel = '#main';

export interface MailResponse {
  title: string;
  content: string;
}

// Extracts mail content HTML from page HTML.
export function getMainEmailContentHTML(page: string) {
  const root = parse(page);
  const mainEl = root.querySelector(mainElSel);
  return (mainEl?.innerHTML ?? '').trim();
}

export function getMainEmailContentElement(page: string) {
  const root = parse(page);
  return root.querySelector(mainElSel);
}
