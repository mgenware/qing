/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { post, user, assUtil, ass } from '../t.js';

post('get-admins: visitor', '/admin/get-admins', 0, null, (data) => {
  assUtil.notAuthorized(data);
});

post('get-admins: user', '/admin/get-admins', user.user, null, (data) => {
  assUtil.notAuthorized(data);
});

post('get-admins: admin', '/admin/get-admins', user.admin, null, (data) => {
  const adminData = data.data.find((d) => d.eid === user.admin.eid);
  ass.de(adminData, user.admin);
});
