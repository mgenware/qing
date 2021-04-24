/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { sendPost } from './t.js';

export class TempUser {
  /**
   * @param {APIResult} r
   */
  constructor(r) {
    /**
     * @type {APIResult}
     * @public
     */
    this.r = r;
  }

  /**
   * @param {APIResult} r
   */
  async dispose() {
    const { eid } = this.r.d;
    if (!eid) {
      throw new Error('Empty EID');
    }
    await sendPost(`/__/auth/del/${eid}`);
  }
}

/**
 * @returns {Promise<TempUser>}
 */
export async function requestNewUser() {
  return new TempUser(await sendPost('/__/auth/new'));
}

/**
 * @param {string} id
 * @returns {Promise<APIResult>}
 */
export async function requestUserInfo(id) {
  return await sendPost(`/__/auth/info/${id}`);
}
