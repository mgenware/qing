/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { html } from 'll';
import ls from 'ls';
import * as authRoute from 'routes/auth';
import './reg/regApp';
import './signIn/signInApp';
import { MiniURLRouter } from 'lib/miniURLRouter';
import pageUtils from 'app/utils/pageUtils';

const authRouter = new MiniURLRouter();

authRouter.register(authRoute.signUp, () => {
  pageUtils.setTitle([ls.createAnAcc]);
  pageUtils.setMainContent(html`<reg-app></reg-app>`);
});
authRouter.register(authRoute.signIn, () => {
  pageUtils.setTitle([ls.signIn]);
  pageUtils.setMainContent(html`<sign-in-app></sign-in-app>`);
});
authRouter.startOnce();
