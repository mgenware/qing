/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { LikeTable, LikeableTable } from '../../models/like/likeTableFactory.js';

const likeInterface = 'LikeInterface';

function updateLikesAction(hostTable: LikeableTable, offset: number): mm.UpdateAction {
  return mm
    .updateOne()
    .from(hostTable)
    .set(hostTable.likes, mm.sql`${hostTable.likes} + ${offset.toString()}`)
    .by(hostTable.id, 'hostID');
}

export default function getLikeTableActions(
  t: LikeTable,
  hostTable: LikeableTable,
): mm.ActionGroup {
  const actions = {
    cancelLike: mm
      .transact(
        mm.deleteOne().whereSQL(mm.and(t.host_id.isEqualToParam(), t.user_id.isEqualToParam())),
        updateLikesAction(hostTable, -1),
      )
      .attr(mm.ActionAttribute.groupTypeName, likeInterface),
    like: mm
      .transact(mm.insertOne().setParams(t.host_id, t.user_id), updateLikesAction(hostTable, 1))
      .attr(mm.ActionAttribute.groupTypeName, likeInterface),
    hasLiked: mm
      .selectExists()
      .whereSQL(mm.and(t.host_id.isEqualToParam(), t.user_id.isEqualToParam()))
      .attr(mm.ActionAttribute.groupTypeName, likeInterface),
  };
  return mm.actionGroupCore(t, null, actions, undefined);
}
