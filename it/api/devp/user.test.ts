/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ita, usr, ass, it, errorResults } from 'base/api';
import { userInfo, newUser } from 'helper/user';
import urls from 'base/urls';

ita('User info', urls.auth.info, null, { body: { uid: usr.admin.id } }, (r) => {
  ass.de(r, {
    d: {
      admin: true,
      id: '2t',
      iconURL: '/res/avatars/2t/50_admin.png',
      url: '/u/2t',
      name: 'ADMIN',
    },
  });
});

it('Add and remove a user', async () => {
  let id = '';
  await newUser(async (u) => {
    // eslint-disable-next-line prefer-destructuring
    id = u.id;
    const ud = { id, iconURL: '/static/img/main/defavatar_50.png', url: `/u/${id}`, name: 'T' };
    ass.de(u, ud);

    // Make sure `__/auth/info` also works.
    const rInfo = await userInfo(id);
    ass.de(rInfo, { d: ud });
  });
  // Check if the user has been removed.
  ass.t(id);
  const nullInfo = await userInfo(id, { ignoreAPIError: true });
  ass.de(nullInfo, errorResults.resNotFound);
});
