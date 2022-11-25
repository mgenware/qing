/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Element } from 'br.js';

const editorContentSel = '.kx-content';

export function shouldHaveHTML(el: Element, html: string) {
  return el.$(editorContentSel).shouldHaveHTML(html);
}

export function fill(el: Element, html: string) {
  return el.$(editorContentSel).c.fill(html);
}
