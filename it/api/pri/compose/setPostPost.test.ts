/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import defs from 'base/defs';
import { post, usr, assUtil, ass, itPost, it } from 'base/api';
import {
  addPostURL,
  getPostCount,
  getPostSrc,
  newPost,
  addPostBody,
  verifyPostAPIResult,
} from 'helper/post';

function getQueuedName(name: string) {
  return { name, queue: defs.queue.userPostCount };
}

it(getQueuedName('Add'), async () => {
  const u = usr.user;
  const pc = await getPostCount(u.eid);
  await newPost(u, async (id) => {
    // Post content.
    ass.de(await getPostSrc(id, u), { contentHTML: defs.sd.postContent, title: defs.sd.postTitle });

    // User post_count.
    const pc2 = await getPostCount(u.eid);
    ass.e(pc + 1, pc2);
  });
});

itPost('Add: visitor', { url: addPostURL, body: addPostBody }, null, (r) => {
  assUtil.notAuthorized(r);
  return Promise.resolve();
});

it(getQueuedName('Edit'), async () => {
  const u = usr.user;
  await newPost(u, async (id) => {
    // Post content.
    const pc = await getPostCount(u.eid);
    const r = await post({ url: addPostURL, body: { ...addPostBody, id }, user: u });
    verifyPostAPIResult(r);
    ass.de(await getPostSrc(id, u), { contentHTML: defs.sd.postContent, title: defs.sd.postTitle });

    const pc2 = await getPostCount(u.eid);
    ass.e(pc, pc2);
  });
});

it(getQueuedName('Edit: wrong user'), async () => {
  const u = usr.user;
  await newPost(u, async (id) => {
    // Post content.
    const pc = await getPostCount(u.eid);
    const r = await post({ url: addPostURL, body: { ...addPostBody, id }, user: usr.admin });
    assUtil.rowNotUpdated(r);

    const pc2 = await getPostCount(u.eid);
    ass.e(pc, pc2);
  });
});
