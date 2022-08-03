/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, usr } from 'api';
import { expect } from 'expect';
import { userInfo, newUser, curUser } from 'helper/user';
import { imgMain } from '@qing/routes/d/static';
import * as apiAuth from '@qing/routes/d/dev/api/auth';

ita('User info', apiAuth.info, { uid: usr.admin.id }, null, (r) => {
  expect(r).toEqual({
    d: {
      admin: true,
      id: '2t',
      iconURL: '/res/avatars/2t/50_admin.png',
      url: '/u/2t',
      name: 'ADMIN',
    },
  });
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
it('Add and remove a user', async () => {
  let id = '';
  await newUser(async (u) => {
    // eslint-disable-next-line prefer-destructuring
    id = u.id;
    const ud = { id, iconURL: `${imgMain}/user.svg`, url: `/u/${id}`, name: 'T' };
    expect(u).toEqual(ud);

    // Make sure `__/auth/info` also works.
    const rInfo = await userInfo(id);
    expect(rInfo).toEqual({ d: ud });

    // Check `__/auth/cur`.
    const curUID = await curUser();
    expect(curUID).toEqual(id);
  });
  // Check if the user has been removed.
  expect(id).toBeTruthy();
  const nullInfo = await userInfo(id, { ignoreAPIError: true });
  expect(nullInfo).toEqual({ code: 10000, msg: 'sql: no rows in result set' });
});
