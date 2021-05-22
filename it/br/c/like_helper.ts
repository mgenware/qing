/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import puppeteer from 'puppeteer';
import * as ass from 'base/ass';

export async function checkLikes(
  likeAppEl: puppeteer.ElementHandle,
  value: number,
  liked: boolean,
) {
  const domInfo = await likeAppEl.evaluate((el: HTMLElement) => {
    const btnEl = el.querySelector('like-view')?.shadowRoot?.querySelector('qing-button');
    if (!btnEl) {
      return null;
    }
    const numEl = btnEl.querySelector('span.num');
    const svgEl = btnEl.querySelector('svg-icon');
    return {
      val: numEl?.textContent,
      selectedStatus: svgEl?.className,
    };
  });
  ass.de(domInfo, {
    val: `${value}`,
    selectedStatus: liked ? 'liked' : 'not-liked',
  });
}
