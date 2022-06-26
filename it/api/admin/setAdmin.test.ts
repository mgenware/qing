/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { errorResults, itaResult, usr, call } from 'api';
import * as assert from 'node:assert';
import { User } from 'base/call';
import { newUser } from 'helper/user';

const url = 'admin/set-admin';
const getAdminsURL = 'admin/admins';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
it('`set-admin` - Visitor', async () => {
  await newUser(async (tu) => {
    const r = await call(url, { target_user_id: tu.id, value: 1 }, null, { ignoreAPIError: true });
    assert.deepStrictEqual(r, errorResults.notAuthorized);
  });
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
it('`set-admin` - User', async () => {
  await newUser(async (tu) => {
    const r = await call(url, { target_user_id: tu.id, value: 1 }, usr.user, {
      ignoreAPIError: true,
    });
    assert.deepStrictEqual(r, errorResults.notAuthorized);
  });
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
it('`set-admin` - Admin', async () => {
  await newUser(async (tu) => {
    const { id } = tu;
    let r = await call(url, { target_user_id: id, value: 1 }, usr.admin);
    assert.deepStrictEqual(r, {});

    // Check status.
    r = await call(getAdminsURL, null, usr.admin);
    let admins = r.d as User[];
    let adminData = admins.find((d) => d.id === id);
    assert.deepStrictEqual(adminData, {
      id,
      name: 'T',
      url: `/u/${id}`,
      iconURL: '/static/img/main/user.svg',
    });

    // Remove an admin.
    r = await call(url, { target_user_id: id, value: 0 }, usr.admin);
    assert.deepStrictEqual(r, {});

    // Check status.
    r = await call(getAdminsURL, null, usr.admin);
    admins = r.d as User[];
    adminData = admins.find((d) => d.id === id);
    assert.strictEqual(adminData, undefined);
  });
});

itaResult(
  'Admin cannot remove itself',
  url,
  { target_user_id: usr.admin.id, value: 0 },
  usr.admin,
  { code: 1 },
);
