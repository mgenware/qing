/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as defs from 'base/defs';
import { call, usr, ass, itaNotAuthorized, it, errorResults } from 'base/api';
import { setEntityURL, getPostCount, getPostSrc, newPost, setEntityBody } from 'helper/post';
import { newUser } from 'helper/user';

it('Add', async () => {
  await newUser(async (u) => {
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
});

itaNotAuthorized('Add: visitor', setEntityURL, null, { body: setEntityBody });

it('Edit', async () => {
  await newUser(async (u) => {
    await newPost(u, async (id) => {
      // Post content.
      const pc = await getPostCount(u.id);
      await call(setEntityURL, { body: { ...setEntityBody, id }, user: u });
      ass.de(await getPostSrc(id, u), {
        contentHTML: defs.sd.postContentSan,
        title: defs.sd.postTitleRaw,
      });

      const pc2 = await getPostCount(u.id);
      ass.e(pc, pc2);
    });
  });
});

it('Edit: wrong user', async () => {
  await newUser(async (u) => {
    await newPost(u, async (id) => {
      // Post content.
      const pc = await getPostCount(u.id);
      const r = await call(setEntityURL, {
        body: { ...setEntityBody, id },
        user: usr.admin,
        ignoreAPIResultErrors: true,
      });
      ass.de(r, errorResults.rowNotUpdated);

      const pc2 = await getPostCount(u.id);
      ass.e(pc, pc2);
    });
  });
});
