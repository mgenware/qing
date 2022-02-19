/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, usr, expect, it, errorResults } from 'api';
import { userInfo, newUser } from 'helper/user';
import * as apiAuth from '@qing/routes/d/dev/api/auth';

ita('User info', apiAuth.info, null, { body: { uid: usr.admin.id } }, (r) => {
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

it('Add and remove a user', async () => {
  let id = '';
  await newUser(async (u) => {
    // eslint-disable-next-line prefer-destructuring
    id = u.id;
    const ud = { id, iconURL: '/static/img/main/defavatar_50.png', url: `/u/${id}`, name: 'T' };
    expect(u).toEqual(ud);

    // Make sure `__/auth/info` also works.
    const rInfo = await userInfo(id);
    expect(rInfo).toEqual({ d: ud });
  });
  // Check if the user has been removed.
  expect(id).toBeTruthy();
  const nullInfo = await userInfo(id, { ignoreAPIError: true });
  expect(nullInfo).toEqual(errorResults.resNotFound);
});
