/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import MarkdownIt from 'markdown-it';

const commonmark = new MarkdownIt('commonmark');

export function htmlToSummary(html: string, length: number): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent ?? '';
  return text.substring(0, length);
}

export function mdToHTML(md: string): string {
  return commonmark.render(md);
}
