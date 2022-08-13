/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, authUsr, usr } from 'br';
import { serverURL } from 'base/def';
import * as nbc from 'br/com/navbar/checks';
import * as ivh from 'br/com/forms/inputViewHelper';
import * as kh from 'br/com/keyboardHelper';
import * as authRoutes from '@qing/routes/d/auth';

const signInAppSel = 'sign-in-app';

test('Sign in - Default fields', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoutes.signIn, null);

  // NOTE: this also checks enter-key-handler.
  const appEl = p.$(`${signInAppSel} ${kh.enterKeyHandlerSel}`);

  const emailEl = appEl.$inputView('Email');
  await ivh.shouldNotHaveError(emailEl);
  await ivh.shouldHaveProps(emailEl, {
    required: true,
    type: 'email',
    autoComplete: 'email',
    inputMode: 'email',
  });
  await ivh.shouldBeEmpty(emailEl);

  const pwdEl = appEl.$inputView('Password');
  await ivh.shouldNotHaveError(pwdEl);
  await ivh.shouldHaveProps(pwdEl, {
    required: true,
    type: 'password',
    autoComplete: 'current-password',
  });
  await ivh.shouldBeEmpty(pwdEl);

  // Make sure "Sign in" button is an enter key responder.
  await kh.shouldBeEnterKeyResponder(appEl.$qingButton('Sign in'));
});

test('Sign in - Validation errors - All', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoutes.signIn, null);

  const appEl = p.$(signInAppSel);
  await appEl.$qingButton('Sign in').click();

  const emailEl = appEl.$inputView('Email');
  await ivh.shouldHaveRequiredError(emailEl);

  const pwdEl = appEl.$inputView('Password');
  await ivh.shouldHaveRequiredError(pwdEl);
});

test('Sign in - Success', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoutes.signIn, null);

  const appEl = p.$(signInAppSel);

  const emailEl = appEl.$inputView('Email');
  await emailEl.fillInput(authUsr.user.email);

  const pwdEl = appEl.$inputView('Password');
  await pwdEl.fillInput(authUsr.user.pwd);

  await Promise.all([
    p.c.waitForNavigation({ url: serverURL }),
    appEl.$qingButton('Sign in').click(),
  ]);
  await nbc.checkUserNavbar($(page), usr.user);
});
