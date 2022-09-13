/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import cmt from '../../models/cmt/cmt.js';
import * as cm from '../../models/common.js';
import cmtAG from './cmtAG.js';
import { CmtRelationTable, cmtHostTableInterface, CmtHostTable } from './cmtAGUtils.js';
import {
  contentBaseStaticAG,
  contentBaseStaticTableParam,
} from '../../actions/com/contentBaseStaticAG.js';

const cmtID = 'cmtID';
const parentID = 'parentID';
const replyID = 'replyID';
const cmtIDAndHostID = 'cmtIDAndHostID';
const hostID = 'hostID';

function getIncrementCmtCountAction(rootCmt: boolean) {
  // When fetching root cmts, `hostID` is exposed via cmt relation table,
  // we only need to reference the outer `hostID` variable via `ValueRef`.
  // When fetching replies, no `hostID` was exposed, we have to explicitly
  // expose the param via `RenameArg`, which renames the `id` param from
  // `contentBaseUtilAG.incrementCmtCount` to `hostID`.
  return contentBaseStaticAG.updateCmtCount.wrap({
    id: rootCmt ? mm.captureVar(hostID) : mm.renameArg(hostID),
    offset: 1,
  });
}

export function insertCmtAction(rt: CmtRelationTable): mm.TransactAction {
  return mm
    .transact(
      // Insert the cmt.
      cmtAG.insertCmtTXM.declareInsertedID(cmtID),
      // Set up relationship with host.
      mm.insertOne().from(rt).setParams().wrapAsRefs({ cmtID }),
      // host.cmtCount++.
      getIncrementCmtCountAction(true),
    )
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(cmtID);
}

export function insertReplyAction(): mm.TransactAction {
  return mm
    .transact(
      // Insert the reply.
      cmtAG.insertReplyTXM.declareInsertedID(replyID),
      // cmt.replyCount++.
      cmtAG.updateReplyCount.wrap({
        offset: 1,
        id: mm.captureVar(parentID),
      }),
      // host.cmtCount++.
      getIncrementCmtCountAction(false),
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
//     updateCmtCountAction(ht, mm.sql`- ${mm.uInt().toParam(replyCount)} - 1`).wrap({
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
        .declareReturnValue(mm.ReturnValueSrc.result, cmtIDAndHostID),
      // Delete the reply.
      cmtAG.deleteCore,
      // cmt.replyCount--.
      contentBaseStaticAG.updateCmtCount.wrap({ [contentBaseStaticTableParam]: ht, offset: -1 }),
      // host.cmtCount--.
      cmtAG.updateReplyCount.wrap({
        offset: -1,
        id: mm.captureVar(`${cmtIDAndHostID}.${parentIDProp}`),
      }),
    )
    .attr(mm.ActionAttribute.groupTypeName, cmtHostTableInterface);
}
