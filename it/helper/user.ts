/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { APIResult, checkAPIResult, post, User } from 'base/post';
import { throwIfEmpty } from 'throw-if-arg-empty';

export class TempUser {
  constructor(public r: APIResult) {}

  get user(): User {
    const { d } = this.r;
    throwIfEmpty(d, 'user');
    return d as User;
  }

  get eid(): string {
    const { eid } = this.user;
    throwIfEmpty(eid, 'eid');
    return eid;
  }
}

async function newUserCore(): Promise<TempUser> {
  const r = await post('/__/auth/new');
  checkAPIResult(r);
  return new TempUser(r);
}

async function deleteUser(uid: string) {
  await post('/__/auth/del', { body: { uid } });
}

// Returns null if the specified user doesn't exist.
export async function userInfo(uid: string): Promise<APIResult> {
  return post('/__/auth/info', { body: { uid } });
}

export async function newUser(cb: (u: TempUser) => Promise<void>) {
  let u: TempUser | undefined;
  try {
    u = await newUserCore();
    await cb(u);
  } finally {
    if (u) {
      await deleteUser(u.eid);
    }
  }
}
