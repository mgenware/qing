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
import { waitForDBTimeChange } from 'base/delay.js';

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

// Verifies the result of the new post API.
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

// Creates a new post and returns the ID.
// Called by newPost() and newTmpPost().
async function newTmpPostCore(user: User, opt: NewPostOptions | undefined) {
  const body = { content: opt?.body ?? defaultComposerContent };
  const r = await entityUtil.setEntity(frozenDef.ContentBaseType.post, body, user);
  const id = verifyNewPostAPIResult(r);
  await entityUtil.updateEntityTime(id, frozenDef.ContentBaseType.post);
  return id;
}

// Returns the link to the post.
export function postLinkFromID(id: string) {
  return `/p/${id}`;
}

// Creates a new post and deletes it after the callback is done.
export async function newPost(
  user: User,
  cb: (arg: { id: string; link: string }) => Promise<unknown>,
  opt?: NewPostOptions,
) {
  let id = null;
  try {
    id = await newTmpPostCore(user, opt);
    await cb({ id, link: postLinkFromID(id) });
  } finally {
    if (id) {
      await entityUtil.delEntity(id, frozenDef.ContentBaseType.post, user);
    }
  }
}

export interface BatchNewPostsOpt {
  prefix: string;
  user: User;
  title: string;
  content: string;
  count: number;
  summary?: string;
}

// Returns the IDs of the new posts.
export async function batchNewPosts(a: BatchNewPostsOpt): Promise<string[]> {
  const { prefix, user, title, content, count, summary } = a;
  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    // eslint-disable-next-line no-await-in-loop
    const id = await newTmpPostCore(user, {
      body: {
        title: `${prefix}${title}_${i}`,
        html: content,
        summary,
      },
    });
    // eslint-disable-next-line no-await-in-loop
    await waitForDBTimeChange();
    ids.push(id);
  }
  return ids;
}

export function deletePostsByPrefix(prefix: string) {
  return entityUtil.deletePostsByPattern(`${prefix}%`);
}
