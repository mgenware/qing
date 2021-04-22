/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { post, user, assUtil, ass } from '../t.js';

post('info', `/__/auth/info/${user.admin.eid}`, 0, null, (r) => {
  ass.de(r, { data: { admin: true, iconName: 'admin.png', ID: 101, name: 'ADMIN' } });
});
