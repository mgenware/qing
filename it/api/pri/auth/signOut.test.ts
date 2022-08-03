/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'expect';
import { newUser, curUser } from 'helper/user';
import { call } from 'api';
import * as authRoute from '@qing/routes/d/s/pri/auth';

it('Sign out', async () => {
  await newUser(async (u) => {
    expect(await curUser()).toBe(u.id);
    await call(authRoute.signOut, null, null);
    expect(await curUser()).toBe(undefined);
  });
});
