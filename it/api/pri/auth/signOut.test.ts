/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { expect } from 'expect';
import cookie from 'cookie';
import { newUser, curUser } from 'helper/user';
import { api, requestLogin } from 'api';
import * as authRoute from '@qing/routes/d/s/pri/auth';
import { Response } from 'node-fetch';

it('Sign out', async () => {
  await newUser(async (u) => {
    // No user is logged in initially.
    expect(await curUser('')).toBe('');
    // Log in.
    const cookies = await requestLogin(u.id);
    expect(await curUser(cookies)).toBe(u.id);

    let signOutCookies: string[] | undefined;
    await api(authRoute.signOut, null, null, {
      cookies,
      setCookiesCb: (s) => (signOutCookies = s),
    });

    expect(signOutCookies).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const cookieData = cookie.parse(signOutCookie!);
    expect(cookieData).toBeTruthy();
    expect(cookieData._ut).toBe('');
  });
});
