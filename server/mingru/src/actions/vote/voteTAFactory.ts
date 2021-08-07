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
function updateVoteAction(
  hostTable: VotableTable,
  upVoteChange: number,
  downVoteChange: number,
  voteChange: number,
): mm.UpdateAction {
  let action = mm.updateOne().from(hostTable);
  if (upVoteChange !== 0) {
    action = action.addAssign(hostTable.up_votes, mm.sql`${upVoteChange.toString()}`);
  }
  if (downVoteChange !== 0) {
    action = action.addAssign(hostTable.down_votes, mm.sql`${downVoteChange.toString()}`);
  }
  if (voteChange !== 0) {
    action = action.addAssign(hostTable.votes, mm.sql`${voteChange.toString()}`);
  }
  return action.by(hostTable.id, 'hostID');
}

function getCancelVoteAction(t: VoteTable, hostTable: VotableTable, upVote: boolean) {
  return mm
    .transact(
      mm.deleteOne().whereSQL(mm.and(t.host_id.isEqualToInput(), t.user_id.isEqualToInput())),
      updateVoteAction(hostTable, upVote ? -1 : 0, upVote ? 0 : -1, -1),
    )
    .attr(mm.ActionAttribute.groupTypeName, voteInterface);
}

function getNewVoteAction(t: VoteTable, hostTable: VotableTable, upVote: boolean) {
  return mm
    .transact(
      mm.insertOne().setInputs(t.host_id, t.user_id).set(t.vote, mm.constants.t),
      updateVoteAction(hostTable, upVote ? 1 : 0, upVote ? 0 : 1, 1),
    )
    .attr(mm.ActionAttribute.groupTypeName, voteInterface);
}

function getSwitchVoteAction(t: VoteTable, hostTable: VotableTable, upVote: boolean) {
  return mm
    .transact(
      mm
        .updateOne()
        .set(t.vote, upVote ? mm.constants.t : mm.constants.f)
        .whereSQL(mm.and(t.host_id.isEqualToInput(), t.user_id.isEqualToInput())),
      updateVoteAction(hostTable, upVote ? 1 : -1, upVote ? -1 : 1, 0),
    )
    .attr(mm.ActionAttribute.groupTypeName, voteInterface);
}

export default function getVoteTableActions(
  t: VoteTable,
  hostTable: VotableTable,
): mm.TableActions {
  const actions = {
    myVote: mm
      .selectField(t.vote)
      .whereSQL(mm.and(t.host_id.isEqualToInput(), t.user_id.isEqualToInput()))
      .attr(mm.ActionAttribute.groupTypeName, voteInterface),

    newUpVote: getNewVoteAction(t, hostTable, true),
    newDownVote: getNewVoteAction(t, hostTable, false),

    cancelUpVote: getCancelVoteAction(t, hostTable, true),
    cancelDownVote: getCancelVoteAction(t, hostTable, false),

    switchToUpVote: getSwitchVoteAction(t, hostTable, true),
    switchToDownVote: getSwitchVoteAction(t, hostTable, false),
  };
  return mm.tableActionsCore(t, null, actions, undefined);
}
