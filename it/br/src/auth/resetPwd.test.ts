/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { $ } from 'br.js';
import * as ivh from 'cm/forms/inputViewHelper.js';
import { newUser } from '@qing/dev/it/helper/user.js';
import * as cm from './cm.js';
import * as kh from 'cm/keyboardHelper.js';
import { expect, test } from '@playwright/test';

const defaultPwd = '111111';
const resetPwdAppSel = 'reset-pwd-app';

test('Reset pwd - UI defaults', async ({ page }) => {
  await newUser(
    async (u) => {
      const p = $(page);
      await cm.doForgotPwdActions(p, u.email);
      await cm.gotoResetPwdPage(p, u.email);
      const appEl = p.$(resetPwdAppSel);

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

      // Make sure "Reset" button is an enter key responder.
      await kh.shouldBeEnterKeyResponder(appEl.$qingButton('Reset'));
    },
    { pwd: defaultPwd },
  );
});

test('Reset pwd - Validation errors - All', async ({ page }) => {
  await newUser(
    async (u) => {
      const p = $(page);
      await cm.doForgotPwdActions(p, u.email);
      await cm.gotoResetPwdPage(p, u.email);
      const appEl = p.$(resetPwdAppSel);

      await appEl.$qingButton('Reset').click();

      const pwdEl = appEl.$inputView('Password');
      await ivh.shouldHaveRequiredError(pwdEl);

      const pwd2El = appEl.$inputView('Confirm password');
      await ivh.shouldHaveRequiredError(pwd2El);
    },
    { pwd: defaultPwd },
  );
});

test('Reset pwd - Password length error', async ({ page }) => {
  await newUser(
    async (u) => {
      const p = $(page);
      await cm.doForgotPwdActions(p, u.email);
      await cm.gotoResetPwdPage(p, u.email);
      const appEl = p.$(resetPwdAppSel);

      const pwdEl = appEl.$inputView('Password');
      const pwd2El = appEl.$inputView('Confirm password');

      async function fillPwd(pwd: string) {
        await pwdEl.fillInput(pwd);
        await pwd2El.fillInput(pwd);
      }

      await fillPwd('1');

      await appEl.$qingButton('Reset').click();
      await ivh.shouldHaveError(pwdEl, 'Password should be at least 6 characters.');
      await ivh.shouldHaveError(pwd2El, 'Confirm password should be at least 6 characters.');
    },
    { pwd: defaultPwd },
  );
});

test("Reset pwd - Passwords don't match", async ({ page }) => {
  await newUser(
    async (u) => {
      const p = $(page);
      await cm.doForgotPwdActions(p, u.email);
      await cm.gotoResetPwdPage(p, u.email);
      const appEl = p.$(resetPwdAppSel);

      const pwdEl = appEl.$inputView('Password');
      await pwdEl.fillInput('123456');
      const pwd2El = appEl.$inputView('Confirm password');
      await pwd2El.fillInput('1234567');

      await appEl.$qingButton('Reset').click();

      const errorView = appEl.$('> enter-key-handler > div > input-error-view');
      await expect(errorView.c).toHaveAttribute('message', "Passwords don't match.");
    },
    { pwd: defaultPwd },
  );
});
