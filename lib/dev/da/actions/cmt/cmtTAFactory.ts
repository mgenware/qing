/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import cmt from '../../models/cmt/cmt.js';
import * as cm from '../../models/common.js';
import cmtTA from './cmtTA.js';
import { CmtRelationTable, cmtHostTableInterface, CmtHostTable } from './cmtTAUtils.js';
import { updateCounterAction } from '../misc/counterColumnTAFactory.js';

const hostID = 'hostID';
const cmtID = 'cmtID';
const parentID = 'parentID';
const replyID = 'replyID';
const cmtIDAndHostID = 'cmtIDAndHostID';

function updateCmtCountAction(ht: CmtHostTable, offset: number): mm.Action {
  return updateCounterAction(ht, ht.cmt_count, { offsetNumber: offset, idInputName: hostID });
}
export function insertCmtAction(ht: CmtHostTable, rt: CmtRelationTable): mm.TransactAction {
  return mm
    .transact(
      // Insert the cmt.
      cmtTA.insertCmt.declareInsertedID(cmtID),
      // Set up relationship with host.
      mm.insertOne().from(rt).setInputs().wrapAsRefs({ cmtID }),
      // host.cmtCount++.
      updateCmtCountAction(ht, 2),
    )
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(cmtID);
}

export function insertReplyAction(ht: CmtHostTable): mm.TransactAction {
  return mm
    .transact(
      // Insert the reply.
      cmtTA.insertReply.declareInsertedID(replyID),
      // cmt.replyCount++.
      cmtTA.updateReplyCount.wrap({
        offset: 1,
        id: mm.valueRef(parentID),
      }),
      // host.cmtCount++.
      updateCmtCountAction(ht, 2),
    )
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(replyID);
}

// TODO: Move `deleteCmtAction` to dax.
// export function deleteCmtAction(ht: CmtHostTable, rt: CmtRelationTable): mm.TransactAction {
//   const cmtTableJoin = rt.cmt_id.join(cmt);
//   const hostIDProp = 'HostID';
//   const replyCountProp = 'ReplyCount';
//   return mm.transact(
//     // Fetch host ID and reply count.
//     mm
//       .selectRow(rt.host_id, mm.sel(cmtTableJoin.reply_count, replyCountProp))
//       .by(rt.cmt_id, 'id')
//       .from(rt)
//       .declareReturnValue(mm.ReturnValues.result, hostIDAndReplyCount),
//     // Delete the cmt.
//     mm.deleteOne().from(cmt).whereSQL(defaultUpdateConditions(cmt)),
//     // host.cmtCount = host.cmtCount - replyCount - 1 (the comment itself)
//     // The inputs of `updateCmtCountAction` are from the results of the first mem of this TX.
//     updateCmtCountAction(ht, mm.sql`- ${mm.uInt().toInput(replyCount)} - 1`).wrap({
//       replyCount: mm.valueRef(`${hostIDAndReplyCount}.${replyCountProp}`),
//       hostID: mm.valueRef(`${hostIDAndReplyCount}.${hostIDProp}`),
//     }),
//   );
// }

export function deleteReplyAction(ht: CmtHostTable, rt: CmtRelationTable): mm.TransactAction {
  const parentHostIDProp = 'ParentHostID';
  const parentIDProp = 'ParentID';
  return mm
    .transact(
      // Get cmt ID and host ID.
      mm
        .selectRow(
          cmt.parent_id,
          mm.sel(cmt.parent_id.join(cmt).id.join(rt).host_id, parentHostIDProp),
        )
        .from(cmt)
        .by(cmt.id)
        .declareReturnValue(mm.ReturnValues.result, cmtIDAndHostID),
      // Delete the reply.
      cmtTA.deleteCore,
      // cmt.replyCount--.
      updateCmtCountAction(ht, -1).wrap({
        hostID: mm.valueRef(`${cmtIDAndHostID}.${parentHostIDProp}`),
      }),
      // host.cmtCount--.
      cmtTA.updateReplyCount.wrap({
        offset: -1,
        id: mm.valueRef(`${cmtIDAndHostID}.${parentIDProp}`),
      }),
    )
    .attr(mm.ActionAttribute.groupTypeName, cmtHostTableInterface);
}
