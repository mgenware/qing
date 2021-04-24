/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ass, assUtil, it, sendPost, usr, post } from '../t.js';
import { requestNewUser } from '../userUtil.js';

const url = 'admin/set-admin';
const getAdminsURL = 'admin/get-admins';

it('set-admin: visitor', async () => {
  const tu = await requestNewUser();
  const r = await sendPost({ url, body: { target_user_id: tu.eid, value: 1 } });
  assUtil.notAuthorized(r);
});

it('set-admin: user', async () => {
  const tu = await requestNewUser();
  const r = await sendPost({
    url,
    user: usr.user,
    body: { target_user_id: tu.eid, value: 1 },
  });
  assUtil.notAuthorized(r);
});

it('set-admin: admin', async () => {
  // Set an admin.
  const tu = await requestNewUser();
  const { eid } = tu;
  let r = await sendPost({
    url,
    user: usr.admin,
    body: { target_user_id: eid, value: 1 },
  });
  ass.de(r, {});

  // Check status.
  r = await sendPost({ url: getAdminsURL, user: usr.admin });
  let adminData = r.d.find((d) => d.eid === eid);
  ass.de(adminData, {
    eid,
    name: 'T',
    url: `/user/${eid}`,
    iconURL: '/static/img/main/defavatar_50.png',
  });

  // Remove an admin.
  r = await sendPost({
    url,
    user: usr.admin,
    body: { target_user_id: eid, value: 0 },
  });
  ass.de(r, {});

  // Check status.
  r = await sendPost({ url: getAdminsURL, user: usr.admin });
  adminData = r.d.find((d) => d.eid === eid);
  ass.e(adminData, undefined);

  // Clean up.
  await tu.eid;
});

post(
  'Admin cannot remove itself',
  { url, body: { target_user_id: usr.admin.eid, value: 0 } },
  usr.admin,
  async (r) => {
    ass.de(r, { code: 1, message: 'Error code: 1' });
  },
);
