/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { itPost, usr, ass, it } from 'base/api';
import { userInfo, newUser } from 'helper/user';

itPost('User info', { url: `/__/auth/info/${usr.admin.eid}` }, null, (r) => {
  ass.de(r, { d: { admin: true, iconName: 'admin.png', eid: '2t', name: 'ADMIN' } });
  return Promise.resolve();
});

it('Add and remove a user', async () => {
  let eid = '';
  await newUser(async (tu) => {
    // eslint-disable-next-line prefer-destructuring
    eid = tu.user.eid;
    ass.de(tu.r, { d: { name: 'T', eid } });

    // Make sure `__/auth/info` also works.
    const rInfo = await userInfo(eid);
    ass.de(rInfo, { d: { name: 'T', eid } });
  });
  // Check if the user has been removed.
  ass.t(eid);
  const nullInfo = await userInfo(eid);
  ass.de(nullInfo, { code: 10005 });
});
