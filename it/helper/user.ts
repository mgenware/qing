/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { APIResult, call, User } from 'base/call';
import { api } from '../base/urls';

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
  const r = await call(api.auth.new);
  return checkUser(r);
}

async function deleteUser(uid: string) {
  await call(api.auth.del, { body: { uid } });
}

// Returns null if the specified user doesn't exist.
export async function userInfo(
  uid: string,
  opts?: { ignoreAPIError?: boolean },
): Promise<APIResult> {
  return call(api.auth.info, { body: { uid }, ignoreAPIResultErrors: opts?.ignoreAPIError });
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
