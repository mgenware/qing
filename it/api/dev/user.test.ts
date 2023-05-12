/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, usr, dontUseRequestLogin } from 'api.js';
import * as assert from 'node:assert';
import { userInfo, newUser, curUser } from 'helper/user.js';
import { defaultUserImg } from '@qing/routes/static.js';
import * as apiAuth from '@qing/routes/dev/api/auth.js';
import CookieJar from 'helper/cookieJar.js';

ita('User info', apiAuth.info, { uid: usr.admin.id }, null, (r) => {
  assert.deepStrictEqual(r, {
    admin: true,
    id: '2t',
    iconURL: '/res/avatars/2t/50_admin.png',
    link: '/u/2t',
    name: 'ADMIN',
  });
});

it('Add and remove a user', async () => {
  let id = '';
  await newUser(async (u) => {
    // eslint-disable-next-line prefer-destructuring
    id = u.id;
    const ud = { id, iconURL: defaultUserImg, link: `/u/${id}`, name: 'T' };
    assert.deepStrictEqual(u, ud);

    // Make sure `__/auth/info` also works.
    const rInfo = await userInfo(id);
    assert.deepStrictEqual(rInfo, ud);
  });
  // Check if the user has been removed.
  assert.ok(id);
  const nullInfo = await userInfo(id);
  assert.strictEqual(nullInfo, null);
});

it('`curUser`', async () => {
  await newUser(async (u) => {
    const cookieJar = new CookieJar();
    // expect(await curUser(cookieJar)).toBe('');

    // Log in.
    await dontUseRequestLogin(u.id, cookieJar);

    // Sample session cookie: "_ut": "102:707280b9-c152-447b-a632-3e6f58e387f0"
    const utVal = cookieJar.get('_ut');
    assert.ok(utVal.includes(':'));
    assert.strictEqual(await curUser(cookieJar), u.id);
  });
});
