/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, usr, dontUseRequestLogin } from 'api';
import { expect } from 'expect';
import { userInfo, newUser, curUser } from 'helper/user';
import { imgMain } from '@qing/routes/d/static';
import * as apiAuth from '@qing/routes/d/dev/api/auth';
import CookieJar from 'helper/cookieJar';

ita('User info', apiAuth.info, { uid: usr.admin.id }, null, (r) => {
  expect(r).toEqual({
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
    const ud = { id, iconURL: `${imgMain}/user-static.svg`, link: `/u/${id}`, name: 'T' };
    expect(u).toEqual(ud);

    // Make sure `__/auth/info` also works.
    const rInfo = await userInfo(id);
    expect(rInfo).toEqual(ud);
  });
  // Check if the user has been removed.
  expect(id).toBeTruthy();
  const nullInfo = await userInfo(id);
  expect(nullInfo).toBeNull();
});

it('`curUser`', async () => {
  await newUser(async (u) => {
    const cookieJar = new CookieJar();
    // expect(await curUser(cookieJar)).toBe('');

    // Log in.
    await dontUseRequestLogin(u.id, cookieJar);

    // Sample session cookie: "_ut": "102:707280b9-c152-447b-a632-3e6f58e387f0"
    const utVal = cookieJar.get('_ut');
    expect(utVal.includes(':')).toBeTruthy();
    expect(await curUser(cookieJar)).toBe(u.id);
  });
});
