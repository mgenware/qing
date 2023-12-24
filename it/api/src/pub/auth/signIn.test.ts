/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as assert from 'node:assert';
import { curUser } from '@qing/dev/it/helper/user.js';
import { api, usr, authUsr, itaResultRaw } from '@qing/dev/it/api.js';
import * as priAuth from '@qing/routes/s/pri/auth.js';
import * as pubAuth from '@qing/routes/s/pub/auth.js';
import CookieJar from '@qing/dev/it/helper/cookieJar.js';

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
    m: 'Invalid username or password.',
  },
);

it('Sign in - Sign out', async () => {
  const cookieJar = new CookieJar();
  // No user is logged in initially.
  assert.strictEqual(await curUser(cookieJar), '');

  // Sign in.
  await api(pubAuth.signIn, { email: authUsr.user.email, pwd: authUsr.user.pwd }, null, {
    cookieJar,
  });

  // Sample session cookie: "_ut": "102:707280b9-c152-447b-a632-3e6f58e387f0"
  const utVal = cookieJar.get('_ut');
  assert.ok(utVal.startsWith('102:'));
  assert.strictEqual(await curUser(cookieJar), usr.user.id);

  await api(priAuth.signOut, null, null, {
    cookieJar,
  });

  // Expected cookies to be deleted.
  assert.strictEqual(cookieJar.cookies(), '_ut=');
});
