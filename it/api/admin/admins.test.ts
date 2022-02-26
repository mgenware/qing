/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, itaNotAuthorized, usr, User, expect } from 'api';
import { admins } from '@qing/routes/d/s/admin';

itaNotAuthorized('admins: visitor', admins, null);

itaNotAuthorized('admins: user', admins, usr.user);

ita('admins: admin', admins, null, usr.admin, (r) => {
  const list = r.d as User[];
  const item = list.find((d) => d.id === usr.admin.id);
  expect(item).toEqual(usr.admin);
});
