/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, itaNotAuthorized, usr, User } from 'api';
import * as assert from 'node:assert';
import * as adminRoute from '@qing/routes/d/s/admin';

itaNotAuthorized('admins: visitor', adminRoute.admins, null);

itaNotAuthorized('admins: user', adminRoute.admins, usr.user);

ita('admins: admin', adminRoute.admins, null, usr.admin, (r) => {
  const list = r.d as User[];
  const item = list.find((d) => d.id === usr.admin.id);
  assert.deepStrictEqual(item, usr.admin);
});
