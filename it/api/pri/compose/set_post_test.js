/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { post, usr, assUtil, ass } from '../../t.js';
import defs from '../../defs.js';

const url = 'pri/compose/set-post';
const postContent = { contentHTML: '_POST_', title: '_TITLE_' };

post(
  'set-post: add-post',
  {
    url,
    body: { entityType: defs.entityPost, content: postContent },
  },
  usr.user,
  (r) => {
    ass.regex(r.d, /\/p\/[a-z0-9]+/);
  },
);
