/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core.js';
import { html } from 'll.js';
import * as authRoute from '@qing/routes/auth.js';
import './signUp/signUpApp.js';
import './signIn/signInApp.js';
import './resetPwd/resetPwdApp.js';
import { MiniURLRouter } from 'lib/miniURLRouter.js';
import * as pu from 'lib/pageUtil.js';

const authRouter = new MiniURLRouter();

authRouter.register(authRoute.signUp, () => {
  pu.setTitle([globalThis.coreLS.createAnAcc]);
  pu.setMainContent(html`<sign-up-app></sign-up-app>`);
});
authRouter.register(authRoute.signIn, () => {
  pu.setTitle([globalThis.coreLS.signIn]);
  pu.setMainContent(html`<sign-in-app></sign-in-app>`);
});
authRouter.register(authRoute.resetPwd, () => {
  pu.setTitle([globalThis.coreLS.resetPwd]);
  pu.setMainContent(html`<reset-pwd-app></reset-pwd-app>`);
});
authRouter.register(authRoute.resetPwd, () => {
  pu.setTitle([globalThis.coreLS.resetPwd]);
  pu.setMainContent(html`<reset-pwd-app></reset-pwd-app>`);
});
authRouter.startOnce();
