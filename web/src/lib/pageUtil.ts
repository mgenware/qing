/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { renderTemplateResult } from 'lib/htmlLib';
import { html, TemplateResult } from 'll';

export function mainContentElement(): HTMLElement {
  const element = window.document.querySelector('body > main');
  if (!element) {
    throw new Error('Fatal error: main content element is null');
  }
  return element as HTMLElement;
}

export function jumpToURL(url: string) {
  window.location.href = url;
}

export function setURL(url: string) {
  window.location.replace(url);
}

export function reload() {
  window.location.reload();
}

export function openWindow(url: string) {
  window.open(url, '_blank');
}

export function setTitle(titles: string[]) {
  document.title = `${titles.join(' - ')} - ${globalThis.coreLS.qingSiteName}`;
}

export function setMainContent(content: TemplateResult) {
  renderTemplateResult(mainContentElement(), html`<div class="container section">${content}</div>`);
}

export function setTitleAndMainContent(titles: string[], content: TemplateResult) {
  setTitle(titles);
  setMainContent(content);
}
