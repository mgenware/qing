/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as def from 'base/def.js';
import { apiRaw, api, usr, itaNotAuthorized, errorGeneric } from 'api.js';
import * as assert from 'node:assert';
import { newPost } from 'helper/post.js';
import { entitySrc } from 'helper/entity.js';
import { postCount, newUser } from 'helper/user.js';
import { frozenDef } from '@qing/def';
import * as composeRoute from '@qing/routes/s/pri/compose.js';

const entityBody = {
  entityType: frozenDef.ContentBaseType.post,
  content: { html: def.sd.contentDBHTML, title: def.sd.title, summary: def.sd.summary },
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
it('Add a post', async () => {
  await newUser(async (u) => {
    const pc = await postCount(u);
    await newPost(u, async ({ id }) => {
      // Post content.
      assert.deepStrictEqual(await entitySrc(id, frozenDef.ContentBaseType.post, u), {
        contentHTML: def.sd.contentDBHTML,
        title: def.sd.title,
      });

      // User post_count.
      const pc2 = await postCount(u);
      assert.strictEqual(pc + 1, pc2);
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
      assert.deepStrictEqual(await entitySrc(id, frozenDef.ContentBaseType.post, u), {
        contentHTML: def.sd.contentDBHTML,
        title: def.sd.title,
      });

      const pc2 = await postCount(u);
      assert.strictEqual(pc, pc2);
    });
  });
});

it('Edit a post with another user', async () => {
  await newUser(async (u) => {
    await newPost(u, async ({ id }) => {
      // Post content.
      const pc = await postCount(u);
      const r = await apiRaw(composeRoute.setEntity, { ...entityBody, id }, usr.admin);
      assert.deepStrictEqual(r, {
        c: errorGeneric,
        m: 'failed to edit item: Expected 1 rows affected, got 0.',
      });

      const pc2 = await postCount(u);
      assert.strictEqual(pc, pc2);
    });
  });
});
