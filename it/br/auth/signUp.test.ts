/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $, api } from 'br';
import * as ivh from 'br/com/forms/inputViewHelper';
import * as authRoutes from '@qing/routes/d/auth';
import * as kh from 'br/com/keyboardHelper';
import * as uuid from 'uuid';
import * as mailAPI from '@qing/routes/d/dev/api/mails';

const signUpAppSel = 'sign-up-app';

test('Sign up - Default fields', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoutes.signUp, null);

  // NOTE: this also checks enter-key-handler.
  const appEl = p.$(`${signUpAppSel} ${kh.enterKeyHandlerSel}`);

  const nameEl = appEl.$inputView('Name');
  await ivh.shouldNotHaveError(nameEl);
  await ivh.shouldHaveProps(nameEl, {
    required: true,
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
    minLength: 6,
    maxLength: 30,
  });
  await ivh.shouldBeEmpty(pwdEl);

  const pwd2El = appEl.$inputView('Confirm password');
  await ivh.shouldNotHaveError(pwdEl);
  await ivh.shouldHaveProps(pwdEl, {
    required: true,
    type: 'password',
    autoComplete: 'new-password',
    minLength: 6,
    maxLength: 30,
  });
  await ivh.shouldBeEmpty(pwd2El);

  // Make sure "Sign up" button is an enter key responder.
  await kh.shouldBeEnterKeyResponder(appEl.$qingButton('Sign up'));
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

  const pwd2El = appEl.$inputView('Confirm password');
  await ivh.shouldHaveRequiredError(pwd2El);
});

test('Sign up - Password length error', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoutes.signUp, null);

  const appEl = p.$(signUpAppSel);
  const email = 't@mgenware.com';
  const name = '__NAME__';

  const nameEl = appEl.$inputView('Name');
  await nameEl.fillInput(name);

  const emailEl = appEl.$inputView('Email');
  await emailEl.fillInput(email);

  const pwdEl = appEl.$inputView('Password');
  const pwd2El = appEl.$inputView('Confirm password');

  async function fillPwd(pwd: string) {
    await pwdEl.fillInput(pwd);
    await pwd2El.fillInput(pwd);
  }

  await fillPwd('1');

  await appEl.$qingButton('Sign up').click();
  await ivh.shouldHaveError(pwdEl, 'Password should be at least 6 characters.');
  await ivh.shouldHaveError(pwd2El, 'Confirm password should be at least 6 characters.');
});

test("Sign up - Password don't match", async ({ page }) => {
  const p = $(page);
  await p.goto(authRoutes.signUp, null);

  const appEl = p.$(signUpAppSel);
  const email = 't@mgenware.com';
  const name = '__NAME__';

  const nameEl = appEl.$inputView('Name');
  await nameEl.fillInput(name);

  const emailEl = appEl.$inputView('Email');
  await emailEl.fillInput(email);

  const pwdEl = appEl.$inputView('Password');
  await pwdEl.fillInput('123456');
  const pwd2El = appEl.$inputView('Confirm password');
  await pwd2El.fillInput('1234567');

  await appEl.$qingButton('Sign up').click();

  const errorView = appEl.$('> enter-key-handler > div > input-error-view');
  await errorView.e.toHaveAttribute('message', "Passwords don't match.");
});

test('Sign up - Success', async ({ page }) => {
  const email = `t_${uuid.v4()}@mgenware.com`;
  try {
    const p = $(page);
    await p.goto(authRoutes.signUp, null);

    const appEl = p.$(signUpAppSel);
    const pwd = '123456';
    const name = '__NAME__';

    const nameEl = appEl.$inputView('Name');
    await nameEl.fillInput(name);

    const emailEl = appEl.$inputView('Email');
    await emailEl.fillInput(email);

    const pwdEl = appEl.$inputView('Password');
    await pwdEl.fillInput(pwd);

    const pwd2El = appEl.$inputView('Confirm password');
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
  } finally {
    await api(mailAPI.eraseUser, { email });
  }
});
