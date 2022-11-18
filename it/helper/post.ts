/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as def from 'base/def';
import { User } from 'api';
import * as entityUtil from './entity';
import { appdef } from '@qing/def';

const postIDRegex = /\/p\/([a-z0-9]+)$/;

export interface PostBodyContent {
  title: string;
  contentHTML: string;
}

const entityBody = {
  content: { contentHTML: def.sd.contentDBHTML, title: def.sd.title },
};

export function verifyNewPostAPIResult(r: string | null): string {
  if (!r) {
    throw new Error('Unexpected null ID');
  }
  const id = postIDRegex.exec(r)?.[1];
  if (typeof id === 'string') {
    return id;
  }
  throw new Error(`ID is not a valid string, got ${id}`);
}

export interface NewPostOptions {
  body?: PostBodyContent;
}

async function newTmpPostCore(user: User, opt: NewPostOptions | undefined) {
  const r = await entityUtil.setEntity(
    appdef.ContentBaseType.post,
    opt?.body ? { content: opt.body } : entityBody,
    user,
  );
  const id = verifyNewPostAPIResult(r);
  await entityUtil.updateEntityTime(id, appdef.ContentBaseType.post);
  return id;
}

function postLink(id: string) {
  return `/p/${id}`;
}

export async function newPost(
  user: User,
  cb: (arg: { id: string; link: string }) => Promise<unknown>,
  opt?: NewPostOptions,
) {
  let id = null;
  try {
    id = await newTmpPostCore(user, opt);
    await cb({ id, link: postLink(id) });
  } finally {
    if (id) {
      await entityUtil.delEntity(id, appdef.ContentBaseType.post, user);
    }
  }
}
