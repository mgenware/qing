/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, itaNotAuthorized, usr, User } from '../../api.js';
import * as assert from 'node:assert';
import * as adminRoute from '@qing/routes/s/admin.js';

itaNotAuthorized('`admins` - Visitor', adminRoute.admins, null);

itaNotAuthorized('`admins` - User', adminRoute.admins, usr.user);

ita<User[]>('`admins` - Admin', adminRoute.admins, null, usr.admin, (list) => {
  const item = list.find((d) => d.id === usr.admin.id);
  assert.deepStrictEqual(item, usr.admin);
});
