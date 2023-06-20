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

// Keep this in sync with sod/post.yaml.
export interface PostCorePayload {
  html: string;
  title?: string;
  src?: string;
  summary?: string;
  brTime?: string;
}

const defaultComposerContent: PostCorePayload = {
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
  body?: PostCorePayload;
}

// Creates a new post and returns the ID.
// Called by newPost() and newTmpPost().
async function newTmpPostCore(user: User, opt: NewPostOptions | undefined) {
  const body = { content: opt?.body ?? defaultComposerContent };
  const r = await entityUtil.setEntity(frozenDef.ContentBaseType.post, body, user);
  const id = verifyNewPostAPIResult(r);
  return id;
}

// Returns the link to the post.
export function postLinkFromID(id: string) {
  return `/p/${id}`;
}

export interface NewPostResult {
  id: string;
  link: string;
}

// Creates a new post and deletes it after the callback is done.
export async function newPost(
  user: User,
  cb: (arg: NewPostResult) => Promise<unknown>,
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
  date?: Date;
}

// Returns the IDs of the new posts.
export async function batchNewPosts(a: BatchNewPostsOpt): Promise<NewPostResult[]> {
  const { prefix, user, title, content, count, summary } = a;
  const results: NewPostResult[] = [];
  for (let i = 0; i < count; i++) {
    // eslint-disable-next-line no-await-in-loop
    const id = await newTmpPostCore(user, {
      body: {
        title: `${prefix}${title}_${i}`,
        html: content,
        summary,
        brTime: a.date?.toISOString(),
      },
    });
    results.push({ id, link: postLinkFromID(id) });
  }
  // Reverse the order so that the latest post is at the top.
  results.reverse();
  return results;
}

export function deletePostsByPrefix(prefix: string) {
  return entityUtil.deletePostsByPattern(`${prefix}%`);
}
