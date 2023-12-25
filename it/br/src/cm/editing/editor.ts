/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BRElement } from 'br.js';
import { expect } from '@playwright/test';

type CoreEditorImpl = unknown;

export enum CoreEditorContentType {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  html,
  md,
}

export interface CoreEditorContent {
  data: string | undefined;
  type: CoreEditorContentType;
}

interface CoreEditorElement extends HTMLElement {
  wait(): Promise<CoreEditorImpl>;
  getContent(editorEl: CoreEditorImpl): CoreEditorContent;
  resetContent(editorEl: CoreEditorImpl, content: string): void;
}

export function editorEl(el: BRElement) {
  return el.$('core-editor');
}

export async function shouldHaveContent(el: BRElement, content: string) {
  const actContent = await el.c.evaluate(
    async (editor: CoreEditorElement) => editor.getContent(await editor.wait()).data,
  );
  expect(actContent).toBe(content);
}

export async function fill(el: BRElement, text: string) {
  const editableEl = el.$('[contenteditable]');
  await editableEl.c.fill(text);
}
