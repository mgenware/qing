/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { test, $ } from 'br.js';
import * as authRoutes from '@qing/routes/auth.js';
import * as ivh from 'br/cm/forms/inputViewHelper.js';
import { newUser } from 'helper/user.js';

test('Reset pwd - UI', async ({ page }) => {
  const p = $(page);
  await p.goto(authRoutes.signIn);

  const forgotPwdBtn = p.$('sign-in-app').$qingButton('Forgot password?');
  await forgotPwdBtn.e.toBeVisible();
  await forgotPwdBtn.click();
  await p.waitForURL(authRoutes.forgotPwd);

  const appEl = p.$('forgot-pwd-app');
  const emailEl = appEl.$inputView('Email');
  await ivh.shouldNotHaveError(emailEl);
  await ivh.shouldHaveProps(emailEl, {
    required: true,
    type: 'email',
    autoComplete: 'email',
    inputMode: 'email',
  });
  await ivh.shouldBeEmpty(emailEl);
});

test('Reset pwd - Success', async ({ page }) => {
  await newUser(async (u) => {
    const p = $(page);
    await p.goto(authRoutes.forgotPwd);

    const appEl = p.$('forgot-pwd-app');
    const emailEl = appEl.$inputView('Email');
    await emailEl.fillInput(u.email);

    // <reset-pwd-app> gets removed when "Sign up" button is clicked.
    const bodyEl = p.body;
    await bodyEl.$qingButton('Next').click();
    await bodyEl.$hasText('h1', 'Almost done...').e.toBeVisible();
    await bodyEl
      .$hasText(
        'p',
        'A verification link has been sent to your email account. Please check your email and click the verification link to complete the process.',
      )
      .e.toBeVisible();
  });
});
