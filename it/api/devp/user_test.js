/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { post, user, assUtil, ass, it, newUser } from '../t.js';

post('User info`', `/__/auth/info/${user.admin.eid}`, 0, (r) => {
  ass.de(r, { d: { admin: true, iconName: 'admin.png', eid: '2t', name: 'ADMIN' } });
});

it('Add and remove an user', async () => {
  const r = await newUser();
  const { eid } = r.d;
  ass.de(r, { d: { name: 'T', eid: eid } });
});
