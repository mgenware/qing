/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as defs from 'base/defs';
import { call, usr, expect, itaNotAuthorized, it, errorResults } from 'api';
import { setEntityURL, getPostCount, getPostSrc, newPost, setEntityBody } from 'helper/post';
import { newUser } from 'helper/user';

it('Add', async () => {
  await newUser(async (u) => {
    const pc = await getPostCount(u.id);
    await newPost(u, async (id) => {
      // Post content.
      expect(await getPostSrc(id, u)).toEqual({
        contentHTML: defs.sd.contentHTML,
        title: defs.sd.title,
      });

      // User post_count.
      const pc2 = await getPostCount(u.id);
      expect(pc + 1).toBe(pc2);
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
      expect(await getPostSrc(id, u)).toEqual({
        contentHTML: defs.sd.contentHTML,
        title: defs.sd.title,
      });

      const pc2 = await getPostCount(u.id);
      expect(pc).toBe(pc2);
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
      expect(r).toEqual(errorResults.rowNotUpdated);

      const pc2 = await getPostCount(u.id);
      expect(pc).toBe(pc2);
    });
  });
});
