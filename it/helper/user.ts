/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { APIResult, call, User } from 'base/call';
import * as apiAuth from '@qing/routes/d/dev/api/auth';

// Copied from `lib/dev/sod/objects/dev/auth/tUserInfo.yaml`.
export interface TUserInfo {
  admin?: boolean;
  id: string;
  iconURL: string;
  url: string;
  name: string;
}

function checkUser(res: APIResult): User {
  const u = res.d as TUserInfo;
  return u;
}

async function newUserCore(): Promise<User> {
  const r = await call(apiAuth.new_);
  return checkUser(r);
}

async function deleteUser(uid: string) {
  await call(apiAuth.del, { body: { uid } });
}

// Returns null if the specified user doesn't exist.
export async function userInfo(
  uid: string,
  opts?: { ignoreAPIError?: boolean },
): Promise<APIResult> {
  return call(apiAuth.info, { body: { uid }, ignoreAPIResultErrors: opts?.ignoreAPIError });
}

export async function newUser(cb: (u: User) => Promise<void>) {
  let u: User | undefined;
  try {
    u = await newUserCore();
    await cb(u);
  } finally {
    if (u) {
      await deleteUser(u.id);
    }
  }
}
