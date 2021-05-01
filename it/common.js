/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export const serverURL = 'http://localhost:12001';
export const loginURL = '/__/auth/in';

export const usr = {
  visitor: 0,
  user: { eid: '2u', name: 'USER', url: '/u/2u', iconURL: '/res/user_icon/101/50_user.png' },
  admin: { eid: '2t', name: 'ADMIN', url: '/u/2t', iconURL: '/res/user_icon/101/50_admin.png' },
};

export function checkAPIResult(r) {
  if (r.code) {
    throw new Error(`The API you are calling returns an error: ${JSON.stringify(r)}`);
  }
}
