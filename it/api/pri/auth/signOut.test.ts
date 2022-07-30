/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as assert from 'node:assert';
import { newUser, curUser } from 'helper/user';
import { call } from 'api';
import * as authRoute from '@qing/routes/d/s/pri/auth';

it('Sign out', async () => {
  await newUser(async (u) => {
    assert.deepStrictEqual(await curUser(), u.id);
    await call(authRoute.signOut, null, null);
    assert.deepStrictEqual(await curUser(), undefined);
  });
});
