/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { post, user, assUtil } from '../t.js';

post('Get admins - Visitor', '/admin/get-admins', 0, null, (data) => {
  assUtil.notAuthorized(data);
});
