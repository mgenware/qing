/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { APIResult, call, User } from 'base/call';
import { throwIfEmpty } from 'throw-if-arg-empty';
import urls from '../base/urls';

export class TempUser {
  constructor(public r: APIResult) {}

  get user(): User {
    const { d } = this.r;
    throwIfEmpty(d, 'user');
    return d as User;
  }

  get id(): string {
    const { id } = this.user;
    throwIfEmpty(id, 'id');
    return id;
  }
}

async function newUserCore(): Promise<TempUser> {
  const r = await call(urls.auth.new);
  return new TempUser(r);
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

export async function newUser(cb: (u: TempUser) => Promise<void>) {
  let u: TempUser | undefined;
  try {
    u = await newUserCore();
    await cb(u);
  } finally {
    if (u) {
      await deleteUser(u.id);
    }
  }
}
