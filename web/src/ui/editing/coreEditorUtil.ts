/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import MarkdownIt from 'markdown-it';
import { CoreEditorContent, CoreEditorContentType } from './coreEditor.js';

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

export interface RenderCoreEditorContentResult {
  html: string;
  src?: string;
}

export function renderCoreEditorContent(content: CoreEditorContent): RenderCoreEditorContentResult {
  switch (content.type) {
    case CoreEditorContentType.html:
      return {
        html: content.data ?? '',
      };

    case CoreEditorContentType.md:
      return {
        src: content.data,
        html: mdToHTML(content.data ?? ''),
      };

    default:
      throw new Error('Invalid content type');
  }
}
