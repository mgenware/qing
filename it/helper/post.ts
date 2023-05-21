/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as def from 'base/def.js';
import { User } from 'api.js';
import * as entityUtil from './entity.js';
import { frozenDef } from '@qing/def';

const postIDRegex = /\/p\/([a-z0-9]+)$/;

export interface CoreEditorContent {
  html: string;
  summary?: string;
  src?: string;
}

export interface ComposerContent extends CoreEditorContent {
  title?: string;
}

const defaultComposerContent: ComposerContent = {
  html: def.sd.contentDBHTML,
  title: def.sd.title,
  summary: 'TEST_POST_SUMMARY',
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
  body?: ComposerContent;
}

async function newTmpPostCore(user: User, opt: NewPostOptions | undefined) {
  const body = { content: opt?.body ?? defaultComposerContent };
  const r = await entityUtil.setEntity(frozenDef.ContentBaseType.post, body, user);
  const id = verifyNewPostAPIResult(r);
  await entityUtil.updateEntityTime(id, frozenDef.ContentBaseType.post);
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
      await entityUtil.delEntity(id, frozenDef.ContentBaseType.post, user);
    }
  }
}
