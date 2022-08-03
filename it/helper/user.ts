/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { APIResult, call, User, CallOptions } from 'base/call';
import * as apiAuth from '@qing/routes/d/dev/api/auth';
import * as apiUser from '@qing/routes/d/dev/api/user';

// Copied from `lib/dev/sod/objects/dev/auth/tUserInfo.yaml`.
export interface TUserInfo {
  admin?: boolean;
  id: string;
  iconURL: string;
  url: string;
  name: string;
}

function getUserObj(res: APIResult): User {
  const u = res.d as TUserInfo;
  return u;
}

async function newUserCore(): Promise<User> {
  const r = await call(apiAuth.new_, null, null);
  return getUserObj(r);
}

async function deleteUser(user: User) {
  await call(apiAuth.del, { uid: user.id }, null);
}

// Gets the current user ID. There is no cookie persistence in API tests. We need to
// manually append cookies.
export async function curUser(cookies: string) {
  return ((await call(apiAuth.cur, null, null, { cookies })).d as number) || 0;
}

// Returns null if the specified user doesn't exist.
export async function userInfo(uid: string, opt?: CallOptions): Promise<APIResult> {
  return call(apiAuth.info, { uid }, null, opt);
}

export async function newUser(cb: (u: User) => Promise<void>) {
  let u: User | undefined;
  try {
    u = await newUserCore();
    await cb(u);
  } finally {
    if (u) {
      await deleteUser(u);
    }
  }
}

export async function postCount(user: User): Promise<number> {
  const r = await call(apiUser.postCount, { uid: user.id }, null);
  if (typeof r.d === 'number') {
    return r.d;
  }
  throw new Error(`Result data is not a valid number, got ${r.d}`);
}
