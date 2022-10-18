/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as br from 'br';

const brBodySpinnerAttr = 'data-brspinner';

async function resolveSequence(...list: Array<Promise<unknown>>) {
  for (const p of list) {
    // eslint-disable-next-line no-await-in-loop
    await p;
  }
}

export async function waitForGlobalFull(
  page: br.Page,
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

export async function waitForGlobal(page: br.Page, text: string, trigger: () => Promise<unknown>) {
  const sel = `body[${brBodySpinnerAttr}=${JSON.stringify(text)}]`;
  await Promise.all([
    trigger(),
    resolveSequence(
      page.c.waitForSelector(sel, { state: 'attached' }),
      page.c.waitForSelector(sel, { state: 'detached' }),
    ),
  ]);
}
