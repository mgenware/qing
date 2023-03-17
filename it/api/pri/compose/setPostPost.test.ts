/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as def from 'base/def.js';
import { apiRaw, api, usr, itaNotAuthorized, errorResults } from 'api.js';
import { expect } from 'expect';
import { newPost } from 'helper/post.js';
import { entitySrc } from 'helper/entity.js';
import { postCount, newUser } from 'helper/user.js';
import { appdef } from '@qing/def';
import * as composeRoute from '@qing/routes/s/pri/compose.js';

const entityBody = {
  entityType: appdef.ContentBaseType.post,
  content: { contentHTML: def.sd.contentDBHTML, title: def.sd.title },
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
it('Add a post', async () => {
  await newUser(async (u) => {
    const pc = await postCount(u);
    await newPost(u, async ({ id }) => {
      // Post content.
      expect(await entitySrc(id, appdef.ContentBaseType.post, u)).toEqual({
        contentHTML: def.sd.contentDBHTML,
        title: def.sd.title,
      });

      // User post_count.
      const pc2 = await postCount(u);
      expect(pc + 1).toBe(pc2);
    });
  });
});

itaNotAuthorized('Add a post - Visitor', composeRoute.setEntity, null);

it('Edit a post', async () => {
  await newUser(async (u) => {
    await newPost(u, async ({ id }) => {
      // Post content.
      const pc = await postCount(u);
      await api(composeRoute.setEntity, { ...entityBody, id }, u);
      expect(await entitySrc(id, appdef.ContentBaseType.post, u)).toEqual({
        contentHTML: def.sd.contentDBHTML,
        title: def.sd.title,
      });

      const pc2 = await postCount(u);
      expect(pc).toBe(pc2);
    });
  });
});

it('Edit a post with another user', async () => {
  await newUser(async (u) => {
    await newPost(u, async ({ id }) => {
      // Post content.
      const pc = await postCount(u);
      const r = await apiRaw(composeRoute.setEntity, { ...entityBody, id }, usr.admin);
      expect(r).toEqual(errorResults.rowNotUpdated);

      const pc2 = await postCount(u);
      expect(pc).toBe(pc2);
    });
  });
});
