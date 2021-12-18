/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { errorResults, it, itaResult, usr, call, expect } from 'api';
import { User } from 'base/call';
import { newUser } from 'helper/user';

const url = 'admin/set-admin';
const getAdminsURL = 'admin/get-admins';

it('set-admin: visitor', async () => {
  await newUser(async (tu) => {
    const r = await call(url, {
      body: { target_user_id: tu.id, value: 1 },
      ignoreAPIResultErrors: true,
    });
    expect(r).toEqual(errorResults.notAuthorized);
  });
});

it('set-admin: user', async () => {
  await newUser(async (tu) => {
    const r = await call(url, {
      user: usr.user,
      body: { target_user_id: tu.id, value: 1 },
      ignoreAPIResultErrors: true,
    });
    expect(r).toEqual(errorResults.notAuthorized);
  });
});

it('set-admin: admin', async () => {
  await newUser(async (tu) => {
    const { id } = tu;
    let r = await call(url, {
      user: usr.admin,
      body: { target_user_id: id, value: 1 },
    });
    expect(r).toEqual({});

    // Check status.
    r = await call(getAdminsURL, { user: usr.admin });
    let admins = r.d as User[];
    let adminData = admins.find((d) => d.id === id);
    expect(adminData).toEqual({
      id,
      name: 'T',
      url: `/u/${id}`,
      iconURL: '/static/img/main/defavatar_50.png',
    });

    // Remove an admin.
    r = await call(url, {
      user: usr.admin,
      body: { target_user_id: id, value: 0 },
    });
    expect(r).toEqual({});

    // Check status.
    r = await call(getAdminsURL, { user: usr.admin });
    admins = r.d as User[];
    adminData = admins.find((d) => d.id === id);
    expect(adminData).toBe(undefined);
  });
});

itaResult(
  'Admin cannot remove itself',
  url,
  usr.admin,
  { body: { target_user_id: usr.admin.id, value: 0 } },
  { code: 1 },
);
