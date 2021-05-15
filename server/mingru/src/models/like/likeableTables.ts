/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newLikeTable, LikeTable, LikeableTable } from './likeTableFactory.js';
import post from '../post/post.js';
import { cmt, reply } from '../cmt/cmt.js';

function notNull<T>(val: T | null | undefined): T {
  if (val === null || val === undefined) {
    throw new Error('Unexpected nullable value');
  }
  return val;
}

const hostTables = [post, cmt, reply];

const likeableTables = new Map<LikeableTable, LikeTable>(
  hostTables.map((hostTable) => [
    hostTable,
    newLikeTable(hostTable.__getData().name, hostTable.id),
  ]),
);

export default likeableTables;
export const postLike = notNull(likeableTables.get(post));
export const cmtLike = notNull(likeableTables.get(cmt));
export const replyLike = notNull(likeableTables.get(reply));
