/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $ } from 'br';
import * as ivh from 'br/com/forms/inputViewHelper';
import * as authRoutes from '@qing/routes/d/auth';
import * as uuid from 'uuid';

const signUpAppSel = 'sign-up-app';

test('Sign up - Default fields', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoutes.signUp, null);

  const appEl = p.$(signUpAppSel);

  const nameEl = appEl.$inputView('Name');
  await ivh.shouldNotHaveError(nameEl);
  await ivh.shouldHaveProps(nameEl, {
    required: true,
    type: 'text',
  });
  await ivh.shouldBeEmpty(nameEl);

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
    autoComplete: 'new-password',
  });
  await ivh.shouldBeEmpty(pwdEl);

  const pwd2El = appEl.$inputView('Confirm Password');
  await ivh.shouldNotHaveError(pwdEl);
  await ivh.shouldHaveProps(pwdEl, {
    required: true,
    type: 'password',
    autoComplete: 'new-password',
  });
  await ivh.shouldBeEmpty(pwd2El);
});

test('Sign up - Validation errors - All', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoutes.signUp, null);

  const appEl = p.$(signUpAppSel);
  await appEl.$qingButton('Sign up').click();

  const nameEl = appEl.$inputView('Name');
  await ivh.shouldHaveRequiredError(nameEl);

  const emailEl = appEl.$inputView('Email');
  await ivh.shouldHaveRequiredError(emailEl);

  const pwdEl = appEl.$inputView('Password');
  await ivh.shouldHaveRequiredError(pwdEl);

  const pwd2El = appEl.$inputView('Confirm Password');
  await ivh.shouldHaveRequiredError(pwd2El);
});

test('Sign up - Success', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoutes.signUp, null);

  const appEl = p.$(signUpAppSel);
  const email = `${uuid.v4()}@mgenware.com`;
  const pwd = '123456';
  const name = '__NAME__';

  const nameEl = appEl.$inputView('Name');
  await nameEl.fillInput(name);

  const emailEl = appEl.$inputView('Email');
  await emailEl.fillInput(email);

  const pwdEl = appEl.$inputView('Password');
  await pwdEl.fillInput(pwd);

  const pwd2El = appEl.$inputView('Confirm Password');
  await pwd2El.fillInput(pwd);

  // sign-up-app has been removed once "Sign up" button is clicked.
  const bodyEl = p.body;
  await bodyEl.$qingButton('Sign up').click();
  await bodyEl.$hasText('h1', 'Almost done...').e.toBeVisible();
  await bodyEl
    .$hasText(
      'p',
      'A verification link has been sent to your email account. Please check your email and click the verification link to complete the registration process.',
    )
    .e.toBeVisible();
});
