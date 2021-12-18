/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, itaNotAuthorized, usr, User, expect } from 'api';

const url = 'admin/get-admins';

itaNotAuthorized('get-admins: visitor', url, null, null);

itaNotAuthorized('get-admins: user', url, usr.user, null);

ita('get-admins: admin', url, usr.admin, null, (r) => {
  const admins = r.d as User[];
  const adminData = admins.find((d) => d.id === usr.admin.id);
  expect(adminData).toEqual(usr.admin);
});
