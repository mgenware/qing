/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as def from 'base/def';
import { call, usr, expect, itaNotAuthorized, it, errorResults } from 'api';
import { scPost } from 'helper/post';
import { entitySrc } from 'helper/entity';
import { postCount, newUser } from 'helper/user';
import { appdef } from '@qing/def';
import * as composeRoute from '@qing/routes/d/s/pri/compose';

const entityBody = {
  entityType: appdef.contentBaseTypePost,
  content: { contentHTML: def.sd.contentHTML, title: def.sd.title },
};

it('Add', async () => {
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

it('Edit', async () => {
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

it('Edit: wrong user', async () => {
  await newUser(async (u) => {
    await scPost(u, async (id) => {
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
