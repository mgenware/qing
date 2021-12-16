/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { APIResult, call, User } from 'base/call';
import { throwIfEmpty } from 'throw-if-arg-empty';
import urls from '../base/urls';

// Copied from `lib/dev/sod/objects/dev/auth/tUserInfo.yaml`.
export interface TUserInfo {
  id: string;
  name?: string;
  iconName?: string;
  admin?: boolean;
}

function checkUser(res: APIResult): TUserInfo {
  const u = res.d as User;
  throwIfEmpty(u.id, 'uid');
  return u;
}

async function newUserCore(): Promise<TUserInfo> {
  const r = await call(urls.auth.new);
  return checkUser(r);
}

async function deleteUser(uid: string) {
  await call(urls.auth.del, { body: { uid } });
}

// Returns null if the specified user doesn't exist.
export async function userInfo(
  uid: string,
  opts?: { ignoreAPIError?: boolean },
): Promise<APIResult> {
  return call(urls.auth.info, { body: { uid }, ignoreAPIResultErrors: opts?.ignoreAPIError });
}

export async function newUser(cb: (u: TUserInfo) => Promise<void>) {
  let u: TUserInfo | undefined;
  try {
    u = await newUserCore();
    await cb(u);
  } finally {
    if (u) {
      await deleteUser(u.id);
    }
  }
}
