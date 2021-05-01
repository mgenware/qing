/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { post, usr, assUtil, ass, itPost, ensureSuccess, it } from '../../t.js';
import defs from '../../defs.js';

const url = 'pri/compose/set-post';

const deletePostURL = 'pri/compose/delete-post';
const postIDRegex = /\/p\/([a-z0-9]+)$/;

const addPostBody = {
  entityType: defs.entity.post,
  content: { contentHTML: '_POST_', title: '_TITLE_' },
};

const getPostCountURL = '/__/user/post_count/';
const getPostSrcURL = 'pri/compose/get-entity-src';

function getQueuedName(name) {
  return { name, queue: defs.queue.userPostCount };
}

/**
 * @param {APIResult} r
 * @returns {string}
 */
function verifyPostAPIResult(r) {
  ensureSuccess(r);
  const id = postIDRegex.exec(r.d)[1];
  if (typeof id !== 'string' || !id.length) {
    throw new Error(`Invalid id "${id}"`);
  }
  return id;
}

/**
 * @param {Object} user
 * @returns {Promise<string>}
 */
async function newTmpPost(user) {
  const r = await post({ url, body: addPostBody, user });
  return verifyPostAPIResult(r);
}

/**
 * @param {string} id
 * @param {Object} user
 * @returns {Promise}
 */
async function deletePost(id, user) {
  return ensureSuccess(
    await post({ url: deletePostURL, user, body: { id, entityType: defs.entity.post } }),
  );
}

/**
 * @param {string} id
 * @returns {Promise<number>}
 */
async function getPostCount(id) {
  const r = await post(`${getPostCountURL}${id}`);
  ensureSuccess(r);
  return parseInt(r.d, 10);
}

/**
 * @param {string} id
 * @param {Object} user
 * @returns {Promise<Object>}
 */
async function getPostSrc(id, user) {
  const r = await post({
    url: getPostSrcURL,
    user,
    body: { entityID: id, entityType: defs.entity.post },
  });
  ensureSuccess(r);
  return r.d;
}

it(getQueuedName('Add'), async () => {
  const u = usr.user;
  const pc = await getPostCount(u.eid);
  const id = await newTmpPost(u);

  // Post content.
  ass.de(await getPostSrc(id, u), { contentHTML: '_POST_', title: '_TITLE_' });

  // User post_count.
  const pc2 = await getPostCount(u.eid);
  ass.e(pc + 1, pc2);

  // Clean up.
  await deletePost(id, u);
});

itPost('Add: visitor', { url, body: addPostBody }, 0, (r) => {
  assUtil.notAuthorized(r);
});

it(getQueuedName('Edit'), async () => {
  const u = usr.user;
  const id = await newTmpPost(u);

  // Post content.
  const pc = await getPostCount(u.eid);
  const r = await post({ url, body: { ...addPostBody, id }, user: u });
  verifyPostAPIResult(r);
  ass.de(await getPostSrc(id, u), { contentHTML: '_POST_', title: '_TITLE_' });

  const pc2 = await getPostCount(u.eid);
  ass.e(pc, pc2);
  await deletePost(id, u);
});

it(getQueuedName('Edit: wrong user'), async () => {
  const u = usr.user;
  const id = await newTmpPost(u);

  // Post content.
  const pc = await getPostCount(u.eid);
  const r = await post({ url, body: { ...addPostBody, id }, user: usr.admin });
  assUtil.rowNotUpdated(r);

  const pc2 = await getPostCount(u.eid);
  ass.e(pc, pc2);
  await deletePost(id, u);
});
