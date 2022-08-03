/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as def from 'base/def';
import { call, usr, itaNotAuthorized, errorResults } from 'api';
import { expect } from 'expect';
import { scPost } from 'helper/post';
import { entitySrc } from 'helper/entity';
import { postCount, newUser } from 'helper/user';
import { appdef } from '@qing/def';
import * as composeRoute from '@qing/routes/d/s/pri/compose';

const entityBody = {
  entityType: appdef.contentBaseTypePost,
  content: { contentHTML: def.sd.contentHTML, title: def.sd.title },
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
it('Add a post', async () => {
  await newUser(async (u) => {
    const pc = await postCount(u);
    await scPost(u, async ({ id }) => {
      // Post content.
      expect(await entitySrc(id, appdef.contentBaseTypePost, u)).toEqual({
        contentHTML: def.sd.contentHTML,
        title: def.sd.title,
      });

      // User post_count.
      const pc2 = await postCount(u);
      expect(pc + 1).toBe(pc2);
    });
  });
});

itaNotAuthorized('Add: visitor', composeRoute.setEntity, null);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
it('Edit a post', async () => {
  await newUser(async (u) => {
    await scPost(u, async ({ id }) => {
      // Post content.
      const pc = await postCount(u);
      await call(composeRoute.setEntity, { ...entityBody, id }, u);
      expect(await entitySrc(id, appdef.contentBaseTypePost, u)).toEqual({
        contentHTML: def.sd.contentHTML,
        title: def.sd.title,
      });

      const pc2 = await postCount(u);
      expect(pc).toBe(pc2);
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
it('Edit a post with another user', async () => {
  await newUser(async (u) => {
    await scPost(u, async ({ id }) => {
      // Post content.
      const pc = await postCount(u);
      const r = await call(composeRoute.setEntity, { ...entityBody, id }, usr.admin, {
        ignoreAPIError: true,
      });
      expect(r).toEqual(errorResults.rowNotUpdated);

      const pc2 = await postCount(u);
      expect(pc).toBe(pc2);
    });
  });
});
