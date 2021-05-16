/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import defs from '../defs.js';
import { ensureSuccess, post } from '../common.js';

export const addPostURL = 'pri/compose/set-post';
export const deletePostURL = 'pri/compose/delete-post';
const postIDRegex = /\/p\/([a-z0-9]+)$/;

export const addPostBody = {
  entityType: defs.entity.post,
  content: { contentHTML: '<p>post_c</p>', title: '<p>post_t</p>' },
};

const getPostCountURL = '/__/user/post_count/';
const getPostSrcURL = 'pri/compose/get-entity-src';

/**
 * @param {APIResult} r
 * @returns {string}
 */
export function verifyPostAPIResult(r) {
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
async function newTmpPostCore(user) {
  const r = await post({ url: addPostURL, body: addPostBody, user });
  return verifyPostAPIResult(r);
}

/**
 * @param {string} id
 * @param {Object} user
 * @returns {Promise}
 */
async function deletePostCore(id, user) {
  return ensureSuccess(
    await post({ url: deletePostURL, user, body: { id, entityType: defs.entity.post } }),
  );
}

/**
 * @name NewTmpPostCallback
 * @function
 * @param {String} id
 */

/**
 * @param {Object} user
 * @param {NewTmpPostCallback} cb
 * @returns {Promise<string>}
 */
export async function newTmpPost(user, cb) {
  let id = null;
  try {
    id = await newTmpPostCore(user);
    await cb(id);
  } finally {
    if (id) {
      await deletePostCore(id, user);
    }
  }
}

/**
 * @param {string} id
 * @returns {Promise<number>}
 */
export async function getPostCount(id) {
  const r = await post(`${getPostCountURL}${id}`);
  ensureSuccess(r);
  return parseInt(r.d, 10);
}

/**
 * @param {string} id
 * @param {Object} user
 * @returns {Promise<Object>}
 */
export async function getPostSrc(id, user) {
  const r = await post({
    url: getPostSrcURL,
    user,
    body: { entityID: id, entityType: defs.entity.post },
  });
  ensureSuccess(r);
  return r.d;
}
