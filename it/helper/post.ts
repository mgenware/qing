/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ass } from 'base/api';
import * as defs from 'base/defs';
import { APIResult, call, updateEntityTime, User } from 'base/call';

export const setEntityURL = 'pri/compose/set-entity';
export const deleteEntityURL = 'pri/compose/delete-entity';
const postIDRegex = /\/p\/([a-z0-9]+)$/;

export const setEntityBody = {
  entityType: defs.entity.post,
  content: { contentHTML: defs.sd.postContentRaw, title: defs.sd.postTitleRaw },
};

const getPostCountURL = '/__/user/post-count';
const getPostSrcURL = 'pri/compose/get-entity-src';

export function verifyPostAPIResult(r: APIResult): string {
  if (typeof r.d !== 'string') {
    throw new Error(`Unexpected API result: ${JSON.stringify(r)}`);
  }
  const id = postIDRegex.exec(r.d)?.[1];
  return ass.isString(id);
}

async function newTmpPostCore(user: User) {
  const r = await call(setEntityURL, { body: setEntityBody, user });
  const id = verifyPostAPIResult(r);
  await updateEntityTime(id, defs.entity.post);
  return id;
}

async function deletePostCore(id: string, user: User) {
  return call(deleteEntityURL, { user, body: { id, entityType: defs.entity.post } });
}

export async function newPost(user: User, cb: (id: string) => Promise<unknown>) {
  let id = null;
  try {
    id = await newTmpPostCore(user);
    await cb(id);
  } finally {
    if (id) {
      await deletePostCore(id, user);
    }
  }
}

export async function getPostCount(uid: string): Promise<number> {
  const r = await call(getPostCountURL, { body: { uid } });
  return ass.isNumber(r.d);
}

export async function getPostSrc(id: string, user: User | undefined) {
  const r = await call(getPostSrcURL, {
    user,
    body: { entityID: id, entityType: defs.entity.post },
  });
  return r.d;
}
