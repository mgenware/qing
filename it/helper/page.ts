/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

const contentRegex = /<main>(.*?)<\/main>/;

// Gets the main content HTML from page HTML.
export function getContentHTML(html: string) {
  const m = html.match(contentRegex);
  if (!m) {
    return '';
  }
  return m[1] ?? '';
}
