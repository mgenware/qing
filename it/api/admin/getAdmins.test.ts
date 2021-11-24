/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itPost, usr, assUtil, ass } from 'base/api';

const url = 'admin/get-admins';

itPost('get-admins: visitor', url, null, null, (r) => {
  assUtil.notAuthorized(r);
  return Promise.resolve();
});

itPost('get-admins: user', url, usr.user, null, (r) => {
  assUtil.notAuthorized(r);
  return Promise.resolve();
});

itPost('get-admins: admin', url, usr.admin, null, (r) => {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  const adminData = (r as any).d.find((d: any) => d.eid === usr.admin.eid);
  ass.de(adminData, usr.admin);
  return Promise.resolve();
});
