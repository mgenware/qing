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
  ass.de(data, {
    data: [
      { eid: '2t', name: 'ADMIN', url: '/user/2t', iconURL: '/res/user_icon/101/50_admin.png' },
    ],
  });
});
