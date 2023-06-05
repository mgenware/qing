/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Element, expect } from 'br.js';

const editorSel = 'core-editor';

type CoreEditorImpl = unknown;

interface CoreEditorElement extends HTMLElement {
  wait(): Promise<CoreEditorImpl>;
  getRenderedContent(editorEl: CoreEditorImpl): string;
  resetRenderedContent(editorEl: CoreEditorImpl, content: string): void;
}

export async function shouldHaveContent(el: Element, content: string) {
  const actContent = await el
    .$(editorSel)
    .c.evaluate(async (editor: CoreEditorElement) =>
      editor.getRenderedContent(await editor.wait()),
    );
  expect(actContent).toBe(content);
}

export async function fill(el: Element, text: string) {
  await el.$(`${editorSel} div[contenteditable=true]`).c.fill(text);
}
