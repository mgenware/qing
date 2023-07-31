/*
 * Copyright (C) 2023 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { Page } from 'br.js';
import * as authRoutes from '@qing/routes/auth.js';
import * as mh from 'helper/mail.js';

export async function doForgotPwdActions(p: Page, email: string) {
  await p.goto(authRoutes.forgotPwd);
  const appEl = p.$('forgot-pwd-app');
  const emailEl = appEl.$inputView('Email');
  await emailEl.fillInput(email);
  await p.body.$qingButton('Next').click();
}

export async function gotoResetPwdPage(p: Page, email: string) {
  const verifyMail = await mh.getLatest({ email });
  const link = mh.getContentLink(verifyMail.content);
  await p.gotoRaw(link);
}