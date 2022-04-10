/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as defs from 'base/defs';
import { APIResult, User } from 'api';
import * as entityUtil from './entity';
import { appdef } from '@qing/def';

const postIDRegex = /\/p\/([a-z0-9]+)$/;

const entityBody = {
  content: { contentHTML: defs.sd.contentHTML, title: defs.sd.title },
};

export function verifyNewPostAPIResult(r: APIResult): string {
  if (typeof r.d !== 'string') {
    throw new Error(`Unexpected API result: ${JSON.stringify(r)}`);
  }
  const id = postIDRegex.exec(r.d)?.[1];
  if (typeof id === 'string') {
    return id;
  }
  throw new Error(`ID is not a valid string, got ${id}`);
}

async function newTmpPostCore(user: User) {
  const r = await entityUtil.setEntity(appdef.contentBaseTypePost, entityBody, user);
  const id = verifyNewPostAPIResult(r);
  await entityUtil.updateEntityTime(id, appdef.contentBaseTypePost);
  return id;
}

function postLink(id: string) {
  return `/p/${id}`;
}

// Creates a self-destructing post.
export async function scPost(
  user: User,
  cb: (arg: { id: string; link: string }) => Promise<unknown>,
) {
  let id = null;
  try {
    id = await newTmpPostCore(user);
    await cb({ id, link: postLink(id) });
  } finally {
    if (id) {
      await entityUtil.delEntity(id, appdef.contentBaseTypePost, user);
    }
  }
}
