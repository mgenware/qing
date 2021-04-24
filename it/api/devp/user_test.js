/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { post, user, assUtil, ass, it } from '../t.js';
import { requestUserInfo, requestNewUser } from '../userUtil.js';

post('User info`', `/__/auth/info/${user.admin.eid}`, 0, (r) => {
  ass.de(r, { d: { admin: true, iconName: 'admin.png', eid: '2t', name: 'ADMIN' } });
});

it('Add and remove an user', async () => {
  const tu = await requestNewUser();
  const { eid } = tu.r.d;
  ass.de(tu.r, { d: { name: 'T', eid: eid } });

  // Make sure `__/auth/info` also works.
  const rInfo = await requestUserInfo(eid);
  ass.de(rInfo, { d: { name: 'T', eid: eid } });

  // `TempUser.dispose` calls `__/auth/del` to remove the user.
  const rDel = await tu.dispose();
  ass.e(rDel, undefined);

  // Check if the user has been removed.
  const nullInfo = await requestUserInfo(eid);
  ass.de(nullInfo, { code: 10000, message: 'resource not found' });
});
