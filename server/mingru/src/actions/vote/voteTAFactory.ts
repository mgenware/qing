/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { VoteTable, VotableTable } from '../../models/vote/voteTableFactory.js';

const voteInterface = 'VoteInterface';

// `value` true: voted, false: vote cancelled.
function updateVoteAction(hostTable: VotableTable, upVote: boolean, value: boolean): mm.UpdateAction {
  let voteChange = 0;
  if (upVote) {
    voteChange = value ? 1 : -1;
  } else {
    voteChange = value ? -1 : 1;
  }
  return mm
    .updateOne()
    .from(hostTable)
    .set(hostTable.votes, mm.sql`${hostTable.votes} + ${voteChange}`)
    .by(hostTable.id, 'hostID');
}

function getCancelVoteAction(
  t: VoteTable,
  hostTable: VotableTable,
) {
  return mm
  .transact(
    mm.deleteOne().whereSQL(mm.and(t.host_id.isEqualToInput(), t.user_id.isEqualToInput())),
    updateLikesAction(hostTable, -1),
  )
  .attr(mm.ActionAttribute.groupTypeName, voteInterface)
}

export default function getLikeTableActions(
  t: VoteTable,
  hostTable: VotableTable,
): mm.TableActions {
  const actions = {
    cancelUpVote: ,
    like: mm
      .transact(mm.insertOne().setInputs(t.host_id, t.user_id), updateLikesAction(hostTable, 1))
      .attr(mm.ActionAttribute.groupTypeName, voteInterface),
    myVote: mm
      .selectField(t.vote)
      .whereSQL(mm.and(t.host_id.isEqualToInput(), t.user_id.isEqualToInput()))
      .attr(mm.ActionAttribute.groupTypeName, voteInterface),
  };
  return mm.tableActionsCore(t, null, actions, undefined);
}
