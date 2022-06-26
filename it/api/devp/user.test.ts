/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, usr, errorResults } from 'api';
import * as assert from 'node:assert';
import { userInfo, newUser } from 'helper/user';
import { imgMain } from '@qing/routes/d/static';
import * as apiAuth from '@qing/routes/d/dev/api/auth';

ita('User info', apiAuth.info, { uid: usr.admin.id }, null, (r) => {
  assert.deepStrictEqual(r, {
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
    assert.deepStrictEqual(u, ud);

    // Make sure `__/auth/info` also works.
    const rInfo = await userInfo(id);
    assert.deepStrictEqual(rInfo, { d: ud });
  });
  // Check if the user has been removed.
  assert.ok(id);
  const nullInfo = await userInfo(id, { ignoreAPIError: true });
  assert.deepStrictEqual(nullInfo, errorResults.resNotFound);
});
