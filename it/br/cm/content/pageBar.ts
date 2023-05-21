/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br.js';

const pageBarCls = 'm-page-bar';

export async function shouldNotExist(container: br.Element) {
  await container.$(`.${pageBarCls}`).shouldNotExist();
}

export interface CheckArgs {
  // Undefined mean link is disabled.
  leftLink?: string;
  rightLink?: string;
}

async function checkLinkValue(el: br.Element, value: string | undefined) {
  if (!value) {
    await el.e.toHaveClass(/content-disabled/);
  } else {
    await el.e.not.toHaveClass(/content-disabled/);
    await el.e.toHaveAttribute('href', value);
  }
}

export async function check(container: br.Element, e: CheckArgs) {
  const el = container.$(`.${pageBarCls}`);
  await el.shouldExist();
  const buttons = el.$$('.link-btn');
  const leftBtn = buttons.item(0);
  const rightBtn = buttons.item(1);
  await checkLinkValue(leftBtn, e.leftLink);
  await checkLinkValue(rightBtn, e.rightLink);
}
