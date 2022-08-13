/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import 'core';
import { html } from 'll';
import ls from 'ls';
import * as authRoute from '@qing/routes/d/auth';
import './signUp/signUpApp';
import './signIn/signInApp';
import { MiniURLRouter } from 'lib/miniURLRouter';
import * as pu from 'app/utils/pageUtils';

const authRouter = new MiniURLRouter();

authRouter.register(authRoute.signUp, () => {
  pu.setTitle([ls.createAnAcc]);
  pu.setMainContent(html`<sign-up-app></sign-up-app>`);
});
authRouter.register(authRoute.signIn, () => {
  pu.setTitle([ls.signIn]);
  pu.setMainContent(html`<sign-in-app></sign-in-app>`);
});
authRouter.startOnce();
