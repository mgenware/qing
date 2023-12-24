/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { LikeTable } from '../../models/like/likeTableFactory.js';

export const isLikedField = 'isLiked';
export const viewerUserIDInput = 'viewerUserID';

export function getLikedColFromEntityID(idCol: mm.Column, likeTable: LikeTable) {
  return idCol
    .leftJoin(
      likeTable,
      likeTable.host_id,
      undefined,
      (jt) => mm.sql`AND ${jt.user_id.isEqualToParam(viewerUserIDInput)}`,
    )
    .user_id.as(isLikedField);
}
