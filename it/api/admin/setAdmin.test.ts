/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { errorResults, itaResultRaw, usr, apiRaw, api } from 'api.js';
import { defaultUserImg } from '@qing/routes/d/static.js';
import { expect } from 'expect';
import { User } from 'base/api.js';
import { newUser } from 'helper/user.js';

const url = 'admin/set-admin';
const getAdminsURL = 'admin/admins';

it('`set-admin` - Visitor', async () => {
  await newUser(async (tu) => {
    const r = await apiRaw(url, { target_user_id: tu.id, value: 1 }, null);
    expect(r).toEqual(errorResults.notAuthorized);
  });
});

it('`set-admin` - User', async () => {
  await newUser(async (tu) => {
    const r = await apiRaw(url, { target_user_id: tu.id, value: 1 }, usr.user);
    expect(r).toEqual(errorResults.notAuthorized);
  });
});

it('`set-admin` - Admin', async () => {
  await newUser(async (tu) => {
    const { id } = tu;

    await api(url, { target_user_id: id, value: 1 }, usr.admin);

    // Check status.
    let admins = await api<User[]>(getAdminsURL, null, usr.admin);
    let adminData = admins.find((d) => d.id === id);
    expect(adminData).toEqual({
      id,
      name: 'T',
      link: `/u/${id}`,
      iconURL: defaultUserImg,
    });

    // Remove an admin.
    await api(url, { target_user_id: id, value: 0 }, usr.admin);

    // Check status.
    admins = await api<User[]>(getAdminsURL, null, usr.admin);
    adminData = admins.find((d) => d.id === id);
    expect(adminData).toBe(undefined);
  });
});

itaResultRaw(
  'Admin cannot remove itself',
  url,
  { target_user_id: usr.admin.id, value: 0 },
  usr.admin,
  { c: 1, m: 'You cannot remove yourself as an admin' },
);
