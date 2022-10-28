/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { api, User, APIOptions } from 'base/api';
import * as apiAuth from '@qing/routes/d/dev/api/auth';
import * as apiUser from '@qing/routes/d/dev/api/user';
import CookieJar from './cookieJar';
import * as uuid from 'uuid';
import { alternativeLocale } from 'br';
import * as mh from './mail';

export interface NewUserOptions {
  alternativeLocale?: boolean;
}

async function newUserCore(opt: NewUserOptions | undefined): Promise<User> {
  return api<User>(
    apiAuth.new_,
    { lang: opt?.alternativeLocale ? alternativeLocale : undefined },
    null,
  );
}

async function deleteUser(user: User) {
  await Promise.all([api(apiAuth.del, { uid: user.id }, null), mh.eraseByID({ id: user.id })]);
}

// Gets the current user ID. There is no cookie persistence in API tests. We need to
// manually append cookies.
export function curUser(cookieJar: CookieJar) {
  return api<string>(apiAuth.cur, null, null, { cookieJar });
}

// Returns null if the specified user doesn't exist.
export async function userInfo(uid: string, opt?: APIOptions): Promise<User | null> {
  return api(apiAuth.info, { uid }, null, opt);
}

export async function newUser(cb: (u: User) => Promise<void> | void, opt?: NewUserOptions) {
  let u: User | undefined;
  try {
    u = await newUserCore(opt);
    await cb(u);
  } finally {
    if (u) {
      await deleteUser(u);
    }
  }
}

export function postCount(user: User): Promise<number> {
  return api<number>(apiUser.postCount, { uid: user.id });
}

export function getEmail(user: User) {
  return api<string>(apiAuth.getEmail, { uid: user.id });
}

export function newEmail() {
  return `zzzUT-${uuid.v4()}@mgenware.com`;
}
