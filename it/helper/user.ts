/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { api, User, APIOptions } from 'base/api.js';
import * as apiAuth from '@qing/routes/dev/api/auth.js';
import * as apiUser from '@qing/routes/dev/api/user.js';
import CookieJar from './cookieJar.js';
import * as uuid from 'uuid';
import { alternativeLocale } from 'br.js';
import * as mh from './mail.js';

export interface NewUserOptions {
  alternativeLocale?: boolean;
  pwd?: string;
  privateAccount?: boolean;
  noNoti?: boolean;
}

export interface DevNewUser extends User {
  email: string;
}

async function newUserCore(opt: NewUserOptions | undefined): Promise<DevNewUser> {
  return api<DevNewUser>(
    apiAuth.new_,
    {
      lang: opt?.alternativeLocale ? alternativeLocale : undefined,
      pwd: opt?.pwd,
      priAccount: opt?.privateAccount,
      noNoti: opt?.noNoti,
    },
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

export async function newUser(cb: (u: DevNewUser) => Promise<void> | void, opt?: NewUserOptions) {
  let u: DevNewUser | undefined;
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
  return `zzzTest-${uuid.v4()}@mgenware.com`;
}
