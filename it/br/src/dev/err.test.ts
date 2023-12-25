/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { $, usr, BRPage } from 'br.js';
import * as errRoutes from '@qing/routes/dev/err.js';
import { expect, test } from '@playwright/test';

function getHTML(content: string) {
  // No need to escape HTML, `content` is our test message.
  return `<html><head><meta name="color-scheme" content="light dark"></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">${content}</pre></body></html>`;
}

async function errorPageShouldAppear(p: BRPage, msg: string) {
  const rootView = p.$('div.text-center');
  await expect(rootView.$('> h1').c).toHaveText('An error occurred');
  await expect(rootView.$('> p.text-danger').c).toHaveText(msg);
}

// ----- NOTE: this file only tests error pages. API errors are tested in API tests. -----

test('404 page', async ({ page }) => {
  const p = $(page);
  const resp = await p.goto('/__NOT_EXIST__', null);
  expect(resp?.status()).toBe(404);
  await errorPageShouldAppear(p, 'The resource you requested does not exist.');
});

test('404 page - logged in', async ({ page }) => {
  const p = $(page);
  const resp = await p.goto('/__NOT_EXIST__', usr.user);
  expect(resp?.status()).toBe(404);
  await errorPageShouldAppear(p, 'The resource you requested does not exist.');
  await p.shouldBeUser(usr.user);
});

test(`Error page - ${errRoutes.panicErr}`, async ({ page }) => {
  const p = $(page);
  const resp = await p.goto(errRoutes.panicErr, null);
  expect(resp?.status()).toBe(500);
  expect(await page.content()).toBe(getHTML('test error'));
});

test(`Error page - ${errRoutes.panicObj}`, async ({ page }) => {
  const p = $(page);
  const resp = await p.goto(errRoutes.panicObj, null);
  expect(resp?.status()).toBe(500);
  expect(await page.content()).toBe(getHTML('-32'));
});

test(`Error page - ${errRoutes.fail}`, async ({ page }) => {
  const p = $(page);
  const resp = await p.goto(errRoutes.fail, null);
  expect(resp?.status()).toBe(500);
  await errorPageShouldAppear(p, 'test error');
});

test(`Error page - ${errRoutes.fail} - logged in`, async ({ page }) => {
  const p = $(page);
  const resp = await p.goto(errRoutes.fail, usr.user);
  expect(resp?.status()).toBe(500);
  await errorPageShouldAppear(p, 'test error');
  await p.shouldBeUser(usr.user);
});
