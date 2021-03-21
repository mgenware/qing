/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { cmt, reply } from '../../models/cmt/cmt';
import user from '../../models/user/user';
import * as cm from '../../models/common';
import cmtTA from './cmtTA';
import { CmtRelationTable, cmtInterface, cmtResultType, CmtHostTable } from './cmtTAUtils';
import replyTA from './replyTA';
import { updateCounterAction } from '../misc/counterColumnTAFactory';
import { defaultUpdateConditions } from '../common';

const hostID = 'hostID';
const cmtID = 'cmtID';
const parentID = 'parentID';
const replyID = 'replyID';
const replyCount = 'replyCount';
const hostIDAndReplyCount = 'hostIDAndReplyCount';
const cmtIDAndHostID = 'cmtIDAndHostID';

export function selectCmts(rt: CmtRelationTable): mm.SelectAction {
  const jCmt = rt.cmt_id.associativeJoin(cmt);
  return mm
    .selectRows(
      rt.cmt_id.privateAttr(),
      jCmt.content,
      jCmt.created_at,
      jCmt.modified_at,
      jCmt.reply_count,
      jCmt.likes,
      jCmt.user_id.privateAttr(),
      jCmt.user_id.join(user).name,
      jCmt.user_id.join(user).icon_name.privateAttr(),
    )
    .from(rt)
    .pageMode()
    .by(rt.host_id)
    .orderByDesc(jCmt.created_at)
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface)
    .resultTypeNameAttr(cmtResultType);
}

export function updateCmtCountAction(pt: CmtHostTable, offsetSQL: number | mm.SQL): mm.Action {
  return updateCounterAction(pt, pt.cmt_count, { rawOffsetSQL: offsetSQL, idInputName: hostID });
}

export function insertCmtAction(ht: CmtHostTable, rt: CmtRelationTable): mm.TransactAction {
  return mm
    .transact(
      // Insert the cmt.
      mm.insertOne().from(cmt).setDefaults().setInputs().declareInsertedID(cmtID),
      // Set up relationship with host.
      mm.insertOne().from(rt).setInputs().wrapAsRefs({ cmtID }),
      // cmt count ++.
      updateCmtCountAction(ht, 1),
    )
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(cmtID);
}

export function deleteCmtAction(ht: CmtHostTable, rt: CmtRelationTable): mm.TransactAction {
  const cmtTableJoin = rt.cmt_id.join(cmt);
  return mm
    .transact(
      // Fetch host ID and reply count.
      mm
        .selectRow(rt.host_id, cmtTableJoin.reply_count)
        .by(rt.cmt_id)
        .from(rt)
        .declareReturnValue(mm.ReturnValues.result, hostIDAndReplyCount),
      // Delete the cmt.
      mm.deleteOne().from(cmt).whereSQL(defaultUpdateConditions(cmt)),
      // host.cmtCount = host.cmtCount - replyCount - 1 (the comment itself)
      // The inputs of `updateCmtCountAction` are from the results of the first mem of this TX.
      updateCmtCountAction(ht, mm.sql`- ${mm.uInt().toInput(replyCount)} - 1`).wrap({
        replyCount: mm.valueRef(`${hostIDAndReplyCount}.ReplyCount`),
        hostID: mm.valueRef(`${hostIDAndReplyCount}.HostID`),
      }),
    )
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface);
}

export function insertReplyAction(ht: CmtHostTable): mm.TransactAction {
  return mm
    .transact(
      // Insert the reply.
      replyTA.insertReplyCore.declareInsertedID(replyID),
      // cmt.replyCount++.
      cmtTA.updateReplyCount.wrap({
        offset: '1',
        id: mm.valueRef(parentID),
      }),
      // host.cmtCount++.
      updateCmtCountAction(ht, 1),
    )
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(replyID);
}

export function deleteReplyAction(ht: CmtHostTable, rt: CmtRelationTable): mm.TransactAction {
  return mm
    .transact(
      // Get cmt ID and host ID.
      mm
        .selectRow(reply.parent_id, reply.parent_id.join(cmt).id.join(rt).host_id)
        .from(reply)
        .by(reply.id)
        .declareReturnValue(mm.ReturnValues.result, cmtIDAndHostID),
      // Delete the reply.
      replyTA.deleteReplyCore,
      // cmt.replyCount--.
      updateCmtCountAction(ht, -1).wrap({ hostID: mm.valueRef(`${cmtIDAndHostID}.ParentHostID`) }),
      // host.cmtCount--.
      cmtTA.updateReplyCount.wrap({
        offset: '-1',
        id: mm.valueRef(`${cmtIDAndHostID}.ParentID`),
      }),
    )
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface);
}
