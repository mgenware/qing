/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'expect';
import { newUser, curUser } from 'helper/user';
import { api, authUsr, itaResultRaw } from 'api';
import * as priAuth from '@qing/routes/d/s/pri/auth';
import * as pubAuth from '@qing/routes/d/s/pub/auth';
import CookieJar from 'helper/cookieJar';

itaResultRaw('Sign in - Missing email', pubAuth.signIn, { pwd: '_' }, null, {
  code: 10000,
  msg: 'the argument `email` is required',
});

itaResultRaw('Sign in - Missing pwd', pubAuth.signIn, { email: '_' }, null, {
  code: 10000,
  msg: 'the argument `pwd` is required',
});

itaResultRaw(
  'Sign in - Wrong pwd',
  pubAuth.signIn,
  { email: authUsr.user.email, pwd: '__' },
  null,
  {
    code: 1,
  },
);

it('Sign in - Success', async () => {
  await newUser(async (u) => {
    const cookieJar = new CookieJar();
    // No user is logged in initially.
    expect(await curUser(cookieJar)).toBe('');
    // Log in.
    await api(pubAuth.signIn, { email: authUsr.user.email, pwd: authUsr.user.pwd }, null, {
      cookieJar,
    });

    // Sample session cookie: "_ut": "102:707280b9-c152-447b-a632-3e6f58e387f0"
    const utVal = cookieJar.get('_ut');
    expect(utVal.startsWith('102:')).toBeTruthy();
    expect(await curUser(cookieJar)).toBe(u.id);

    await api(priAuth.signOut, null, null, {
      cookieJar,
    });

    expect(cookieJar.cookies()).toBe('');
  });
});
