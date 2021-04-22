/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { post, user, assUtil, ass } from '../t.js';

post('get-admins: visitor', 'admin/get-admins', 0, null, (r) => {
  assUtil.notAuthorized(r);
});

post('get-admins: user', 'admin/get-admins', user.user, null, (r) => {
  assUtil.notAuthorized(r);
});

post('get-admins: admin', 'admin/get-admins', user.admin, null, (r) => {
  const adminData = r.data.find((d) => d.eid === user.admin.eid);
  ass.de(adminData, user.admin);
});
