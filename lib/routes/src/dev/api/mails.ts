/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import root from './root.js';

const mailRoot = `${root}/mails`;

export const get = `${mailRoot}/get`;
export const getLatest = `${mailRoot}/get-latest`;
export const sendReal = `${mailRoot}/send-real`;
export const eraseUser = `${mailRoot}/erase-user`;
export const eraseUserByID = `${mailRoot}/erase-user-by-id`;
export const users = `${mailRoot}/users`;
export const inbox = `${mailRoot}/inbox`;
