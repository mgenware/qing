/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from '@playwright/test';
import * as br from 'br.js';

const pageBarSel = '.m-page-bar';
const linkBtnSel = '.link-btn';

export async function shouldNotExist(container: br.BRElement) {
  await container.$(pageBarSel).shouldNotExist();
}

export interface CheckArgs {
  // Undefined mean link is disabled.
  leftLink?: string;
  rightLink?: string;
}

async function checkLinkValue(el: br.BRElement, value: string | undefined) {
  if (!value) {
    await expect(el.c).toHaveClass(/content-disabled/);
  } else {
    await expect(el.c).not.toHaveClass(/content-disabled/);
    await expect(el.c).toHaveAttribute('href', value);
  }
}

export async function check(container: br.BRElement, e: CheckArgs) {
  const el = container.$(pageBarSel);
  await el.shouldExist();
  const buttons = el.$$(linkBtnSel);
  const leftBtn = buttons.item(0);
  const rightBtn = buttons.item(1);
  await checkLinkValue(leftBtn, e.leftLink);
  await checkLinkValue(rightBtn, e.rightLink);
}

export async function clickNextBtn(container: br.BRElement) {
  const el = container.$(pageBarSel);
  const buttons = el.$$(linkBtnSel);
  const rightBtn = buttons.item(1);
  await rightBtn.click();
}
