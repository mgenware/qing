/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { post, usr, assUtil, ass, sendPost, ensureSuccess, it } from '../../t.js';
import defs from '../../defs.js';

const url = 'pri/compose/set-post';

const deletePostURL = 'pri/compose/delete-post';
const postIDRegex = /\/p\/([a-z0-9]+)$/;

const addPostBody = {
  entityType: defs.entityPost,
  content: { contentHTML: '_POST_', title: '_TITLE_' },
};

const getPostCountURL = '/__/user/post_count/';

/**
 * @param {Object} user
 * @returns {Promise<string>}
 */
async function newTmpPost(user) {
  const r = await sendPost({ url, body: addPostBody, user });
  ensureSuccess(r);
  const id = postIDRegex.exec(r.d)[1];
  ass.t(typeof id === 'string');
  return id;
}

/**
 * @param {string} id
 * @param {Object} user
 * @returns {Promise}
 */
async function deletePost(id, user) {
  return ensureSuccess(
    await sendPost({ url: deletePostURL, user, body: { id, entityType: defs.entityPost } }),
  );
}

/**
 * @param {string} id
 * @returns {Promise<number>}
 */
async function getPostCount(id) {
  const r = await sendPost(`${getPostCountURL}${id}`);
  ensureSuccess(r);
  return parseInt(r.d, 10);
}

it('Add', async () => {
  const u = usr.user;
  const pc = await getPostCount(u.eid);
  const id = await newTmpPost(u);
  const pc2 = await getPostCount(u.eid);
  ass.e(pc + 1, pc2);
  await deletePost(id, u);
});

post('Add: visitor', { url, body: addPostBody }, 0, (r) => {
  assUtil.notAuthorized(r);
});
