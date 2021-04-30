/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { post, usr, assUtil, ass, sendPost } from '../../t.js';
import defs from '../../defs.js';

const url = 'pri/compose/set-post';
const postContent = { contentHTML: '_POST_', title: '_TITLE_' };

const deletePostURL = 'pri/compose/set-post';
const postIDRegex = /\/p\/([a-z0-9]+)$/;

/**
 * @param {string} id
 * @returns {Promise<APIResult>}
 */
async function deletePost(id) {
  return sendPost({ url: deletePostURL, body: { id, entityType: defs.entityPost } });
}

post(
  'set-post: add-post',
  {
    url,
    body: { entityType: defs.entityPost, content: postContent },
  },
  usr.user,
  async (r) => {
    ass.regex(r.d, postIDRegex);
    const id = postIDRegex.exec(r.d);
    ass.t(id);
    await deletePost(id);
  },
);
