/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { iShouldNotCallThisDelay } from '@qing/dev/it/base/delay.js';
import * as br from 'br.js';

const brGSpinnerTextAttr = 'data-br-spinner-text';
const brGSpinnerCounterAttr = 'data-br-spinner-counter';

async function resolveSequence(...list: Array<Promise<unknown>>) {
  for (const p of list) {
    // eslint-disable-next-line no-await-in-loop
    await p;
  }
}

export async function waitForGlobalFull(
  page: br.BRPage,
  text: string,
  trigger: () => Promise<unknown>,
) {
  const sel = `#__g_spinner_container spinner-view:has-text(${JSON.stringify(text)})`;
  await Promise.all([
    trigger(),
    resolveSequence(
      page.c.waitForSelector(sel, { state: 'attached' }),
      page.c.waitForSelector(sel, { state: 'detached' }),
    ),
  ]);
}

export async function waitForGlobal(
  page: br.BRPage,
  text: string,
  trigger: () => Promise<unknown>,
) {
  const counter =
    (parseInt((await page.body.getAttribute(brGSpinnerCounterAttr)) ?? '0', 10) || 0) + 1;
  const sel = `body[${brGSpinnerCounterAttr}="${counter}"][${brGSpinnerTextAttr}=${JSON.stringify(
    text,
  )}]`;
  await Promise.all([trigger(), page.c.waitForSelector(sel, { state: 'attached' })]);
  // Wait for UI update.
  await iShouldNotCallThisDelay();
}
