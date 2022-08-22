/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'expect';
import { curUser } from 'helper/user';
import { api, usr, authUsr, itaResultRaw } from 'api';
import * as priAuth from '@qing/routes/d/s/pri/auth';
import * as pubAuth from '@qing/routes/d/s/pub/auth';
import CookieJar from 'helper/cookieJar';

itaResultRaw('Sign in - Missing email', pubAuth.signIn, { pwd: '_' }, null, {
  c: 1,
  m: 'the argument `email` is required',
});

itaResultRaw('Sign in - Missing pwd', pubAuth.signIn, { email: '_' }, null, {
  c: 1,
  m: 'the argument `pwd` is required',
});

itaResultRaw(
  'Sign in - Wrong pwd',
  pubAuth.signIn,
  { email: authUsr.user.email, pwd: '__' },
  null,
  {
    c: 1,
    m: 'Invalid username or password',
  },
);

it('Sign in - Sign out', async () => {
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
  expect(await curUser(cookieJar)).toBe(usr.user.id);

  await api(priAuth.signOut, null, null, {
    cookieJar,
  });

  // Expected cookies to be deleted.
  expect(cookieJar.cookies()).toBe('_ut=');
});
