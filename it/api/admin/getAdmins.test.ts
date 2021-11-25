/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itPost, usr, assUtil, ass, User } from 'base/api';

const url = 'admin/get-admins';

itPost('get-admins: visitor', url, null, null, (r) => {
  assUtil.notAuthorized(r);
});

itPost('get-admins: user', url, usr.user, null, (r) => {
  assUtil.notAuthorized(r);
});

itPost('get-admins: admin', url, usr.admin, null, (r) => {
  const admins = r.d as User[];
  const adminData = admins.find((d) => d.id === usr.admin.id);
  ass.de(adminData, usr.admin);
});
