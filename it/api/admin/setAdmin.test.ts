/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ass, assUtil, it, itPost, usr, post } from 'base/api';
import { User } from 'base/post';
import { newUser } from 'helper/user';

const url = 'admin/set-admin';
const getAdminsURL = 'admin/get-admins';

it('set-admin: visitor', async () => {
  await newUser(async (tu) => {
    const r = await post(url, { body: { target_user_id: tu.id, value: 1 } });
    assUtil.notAuthorized(r);
  });
});

it('set-admin: user', async () => {
  await newUser(async (tu) => {
    const r = await post(url, {
      user: usr.user,
      body: { target_user_id: tu.id, value: 1 },
    });
    assUtil.notAuthorized(r);
  });
});

it('set-admin: admin', async () => {
  await newUser(async (tu) => {
    const { id } = tu;
    let r = await post(url, {
      user: usr.admin,
      body: { target_user_id: id, value: 1 },
    });
    ass.de(r, {});

    // Check status.
    r = await post(getAdminsURL, { user: usr.admin });
    let admins = r.d as User[];
    let adminData = admins.find((d) => d.id === id);
    ass.de(adminData, {
      id,
      name: 'T',
      url: `/u/${id}`,
      iconURL: '/static/img/main/defavatar_50.png',
    });

    // Remove an admin.
    r = await post(url, {
      user: usr.admin,
      body: { target_user_id: id, value: 0 },
    });
    ass.de(r, {});

    // Check status.
    r = await post(getAdminsURL, { user: usr.admin });
    admins = r.d as User[];
    adminData = admins.find((d) => d.id === id);
    ass.e(adminData, undefined);
  });
});

itPost(
  'Admin cannot remove itself',
  url,
  usr.admin,
  { body: { target_user_id: usr.admin.id, value: 0 } },
  (r) => {
    ass.de(r, { code: 1 });
    return Promise.resolve();
  },
);
