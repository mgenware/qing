/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { newLikeTable, LikeTable, LikeableTable } from './likeTableFactory';
import post from '../post/post';
import { cmt, reply } from '../cmt/cmt';

const hostTables = [post, cmt, reply];

const likeableTables = new Map<LikeableTable, LikeTable>(
  hostTables.map((hostTable) => [
    hostTable,
    newLikeTable(hostTable.__getData().name, hostTable.id),
  ]),
);

export default likeableTables;
