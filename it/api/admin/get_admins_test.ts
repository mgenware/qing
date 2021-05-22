/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itPost, usr, assUtil, ass } from 'base/api';

const url = 'admin/get-admins';

itPost('get-admins: visitor', url, null, (r) => {
  assUtil.notAuthorized(r);
});

itPost('get-admins: user', url, usr.user, (r) => {
  assUtil.notAuthorized(r);
});

itPost('get-admins: admin', url, usr.admin, (r) => {
  const adminData = (r as any).d.find((d: any) => d.eid === usr.admin.eid);
  ass.de(adminData, usr.admin);
});
