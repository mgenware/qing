/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Element, expect } from 'br.js';

const editorSel = 'core-editor';

interface CoreEditorElement extends HTMLElement {
  getRenderedContent(): string;
  resetRenderedContent(content: string): void;
}

export async function shouldHaveContent(el: Element, content: string) {
  const actContent = await el
    .$(editorSel)
    .c.evaluate((editor: CoreEditorElement) => editor.getRenderedContent());
  expect(actContent).toBe(content);
}

export function fill(el: Element, html: string) {
  return el
    .$(editorSel)
    .c.evaluate((editor: CoreEditorElement) => editor.resetRenderedContent(html));
}
