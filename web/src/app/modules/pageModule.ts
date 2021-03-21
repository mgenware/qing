/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { renderTemplateResult } from 'lib/htmlLib';
import { TemplateResult, html } from 'lit-element';
import ls from 'ls';

export default class PageModule {
  get mainContentElement(): HTMLElement {
    const element = window.document.getElementById('main-body');
    if (!element) {
      throw new Error('Fatal error: main content element is null');
    }
    return element;
  }

  jumpToURL(url: string) {
    window.location.href = url;
  }

  setURL(url: string) {
    window.location.replace(url);
  }

  reload() {
    window.location.reload();
  }

  openWindow(url: string) {
    window.open(url, '_blank');
  }

  setTitle(titles: string[]) {
    document.title = `${titles.join(' - ')} - ${ls._siteName}`;
  }

  setMainContent(content: TemplateResult) {
    renderTemplateResult(
      this.mainContentElement,
      html`<container-view>${content}</container-view>`,
    );
  }

  setTitleAndMainContent(titles: string[], content: TemplateResult) {
    this.setTitle(titles);
    this.setMainContent(content);
  }
}
