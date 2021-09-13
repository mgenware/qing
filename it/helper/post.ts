/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { ass } from 'base/api';
import defs from 'base/defs';
import { APIResult, ensureSuccess, post, updateEntityTime, User } from 'base/post';

export const addEntityURL = 'pri/compose/set-entity';
export const deleteEntityURL = 'pri/compose/delete-entity';
const postIDRegex = /\/p\/([a-z0-9]+)$/;

export const addPostBody = {
  entityType: defs.entity.post,
  content: { contentHTML: defs.sd.postContentRaw, title: defs.sd.postTitleRaw },
};

const getPostCountURL = '/__/user/post_count/';
const getPostSrcURL = 'pri/compose/get-entity-src';

export function verifyPostAPIResult(r: APIResult): string {
  ensureSuccess(r);
  if (typeof r.d !== 'string') {
    throw new Error(`Unexpected API result: ${JSON.stringify(r)}`);
  }
  const id = postIDRegex.exec(r.d)?.[1];
  return ass.isString(id);
}

async function newTmpPostCore(user: User) {
  const r = await post({ url: addPostURL, body: addPostBody, user });
  const id = verifyPostAPIResult(r);
  ensureSuccess(await updateEntityTime(id, defs.entity.post));
  return id;
}

async function deletePostCore(id: string, user: User) {
  return ensureSuccess(
    await post({ url: deletePostURL, user, body: { id, entityType: defs.entity.post } }),
  );
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

export async function getPostCount(id: string): Promise<number> {
  const r = await post(`${getPostCountURL}${id}`);
  ensureSuccess(r);
  return ass.isNumber(r.d);
}

export async function getPostSrc(id: string, user: User | undefined) {
  const r = await post({
    url: getPostSrcURL,
    user,
    body: { entityID: id, entityType: defs.entity.post },
  });
  ensureSuccess(r);
  return r.d;
}
