/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { parse } from 'node-html-parser';

export interface MailResponse {
  title: string;
  content: string;
}

// Extracts mail content HTML from page HTML.
export function getMailContentHTML(page: string) {
  const root = parse(page);
  const mainEl = root.querySelector('#main');
  return (mainEl?.innerHTML ?? '').trim();
}
