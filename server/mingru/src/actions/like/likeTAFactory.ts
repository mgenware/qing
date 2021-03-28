/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { LikeTable, LikeableTable } from '../../models/like/likeTableFactory';

const likeInterface = 'LikeInterface';

function updateLikesAction(hostTable: LikeableTable, offset: number): mm.UpdateAction {
  return mm
    .updateOne()
    .from(hostTable)
    .set(hostTable.likes, mm.sql`${hostTable.likes} + ${offset.toString()}`)
    .by(hostTable.id, 'hostID');
}

export default function getLikeTableActions(
  table: LikeTable,
  hostTable: LikeableTable,
): mm.TableActions {
  const actions = {
    cancelLike: mm
      .transact(
        mm
          .deleteOne()
          .whereSQL(mm.and(table.host_id.isEqualToInput(), table.user_id.isEqualToInput())),
        updateLikesAction(hostTable, -1),
      )
      .attr(mm.ActionAttribute.groupTypeName, likeInterface),
    like: mm
      .transact(
        mm.insertOne().setInputs(table.host_id, table.user_id),
        updateLikesAction(hostTable, 1),
      )
      .attr(mm.ActionAttribute.groupTypeName, likeInterface),
    hasLiked: mm
      .selectExists()
      .whereSQL(mm.and(table.host_id.isEqualToInput(), table.user_id.isEqualToInput()))
      .attr(mm.ActionAttribute.groupTypeName, likeInterface),
  };
  return mm.tableActionsCore(table, null, actions, undefined);
}
