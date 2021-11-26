/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as defs from 'base/defs';
import { post, usr, ass, itaNotAuthorized, it, errorResults } from 'base/api';
import {
  setEntityURL,
  getPostCount,
  getPostSrc,
  newPost,
  setEntityBody,
  verifyPostAPIResult,
} from 'helper/post';

function getQueuedName(name: string) {
  return { name, queue: defs.queue.userPostCount };
}

it(getQueuedName('Add'), async () => {
  const u = usr.user;
  const pc = await getPostCount(u.id);
  await newPost(u, async (id) => {
    // Post content.
    ass.de(await getPostSrc(id, u), {
      contentHTML: defs.sd.postContentSan,
      title: defs.sd.postTitleRaw,
    });

    // User post_count.
    const pc2 = await getPostCount(u.id);
    ass.e(pc + 1, pc2);
  });
});

itaNotAuthorized('Add: visitor', setEntityURL, null, { body: setEntityBody });

it(getQueuedName('Edit'), async () => {
  const u = usr.user;
  await newPost(u, async (id) => {
    // Post content.
    const pc = await getPostCount(u.id);
    const r = await post(setEntityURL, { body: { ...setEntityBody, id }, user: u });
    verifyPostAPIResult(r);
    ass.de(await getPostSrc(id, u), {
      contentHTML: defs.sd.postContentRaw,
      title: defs.sd.postTitleRaw,
    });

    const pc2 = await getPostCount(u.id);
    ass.e(pc, pc2);
  });
});

it(getQueuedName('Edit: wrong user'), async () => {
  const u = usr.user;
  await newPost(u, async (id) => {
    // Post content.
    const pc = await getPostCount(u.id);
    const r = await post(setEntityURL, { body: { ...setEntityBody, id }, user: usr.admin });
    ass.de(r, errorResults.rowNotUpdated);

    const pc2 = await getPostCount(u.id);
    ass.e(pc, pc2);
  });
});
