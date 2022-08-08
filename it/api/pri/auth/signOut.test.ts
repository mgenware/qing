/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'expect';
import { newUser, curUser } from 'helper/user';
import { api, authUsr } from 'api';
import * as priAuth from '@qing/routes/d/s/pri/auth';
import * as pubAuth from '@qing/routes/d/s/pub/auth';
import CookieJar from 'helper/cookieJar';

it('Sign out', async () => {
  await newUser(async (u) => {
    const jar = new CookieJar();
    // No user is logged in initially.
    expect(await curUser(jar)).toBe('');
    // Log in.
    await api(pubAuth.signIn, { email: authUsr.user.email, pwd: authUsr.user.pwd });
    expect(await curUser(jar)).toBe(u.id);

    const cookieJar = new CookieJar();
    await api(priAuth.signOut, null, null, {
      cookieJar,
    });

    expect(jar.cookies()).toBe('');
  });
});
