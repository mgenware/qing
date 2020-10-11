import * as mm from 'mingru-models';
import { cmt, reply } from '../models/cmt';
import user from '../models/user';
import * as cm from '../models/common';
import cmtTA from './cmtTA';
import {
  CmtRelationTable,
  cmtInterface,
  cmtResultType,
  CmtHostTable,
  updateConditions,
} from './cmtTAUtils';
import replyTA from './replyTA';

const hostID = 'hostID';
const cmtID = 'cmtID';
const parentID = 'parentID';
const replyID = 'replyID';
const replyCount = 'replyCount';
const hostIDAndReplyCount = 'hostIDAndReplyCount';

export function selectCmts(rt: CmtRelationTable): mm.SelectAction {
  const jCmt = rt.cmt_id.associativeJoin(cmt);
  return mm
    .selectPage(
      rt.cmt_id.privateAttr(),
      jCmt.content,
      jCmt.created_at,
      jCmt.modified_at,
      jCmt.reply_count,
      jCmt.user_id.privateAttr(),
      jCmt.user_id.join(user).name,
      jCmt.user_id.join(user).icon_name.privateAttr(),
    )
    .from(rt)
    .by(rt.host_id)
    .orderByDesc(jCmt.created_at)
    .attrs({
      [mm.ActionAttributes.groupTypeName]: cmtInterface,
      [mm.ActionAttributes.resultTypeName]: cmtResultType,
    });
}

export function updateCmtCountAction(pt: CmtHostTable, offset: number | mm.SQL): mm.Action {
  let offsetExpr: mm.SQL | string;
  if (offset instanceof mm.SQL) {
    offsetExpr = offset;
  } else {
    // Produce `+ <offset>` or `- <offset>`.
    offsetExpr = offset < 0 ? offset.toString() : `+ ${offset}`;
  }
  return mm
    .updateOne()
    .from(pt)
    .set(pt.cmt_count, mm.sql`${pt.cmt_count} ${offsetExpr}`)
    .whereSQL(updateConditions(pt, hostID));
}

export function insertCmtAction(ht: CmtHostTable, rt: CmtRelationTable): mm.TransactAction {
  return mm
    .transact(
      mm.insertOne().from(cmt).setDefaults().setInputs().declareInsertedID(cmtID),
      mm.insertOne().from(rt).setInputs().wrapAsRefs({ cmtID }),
      updateCmtCountAction(ht, 1),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(cmtID);
}

export function deleteCmtAction(ht: CmtHostTable): mm.TransactAction {
  return mm
    .transact(
      cmtTA.getHostIDAndReplyCount.declareReturnValue(mm.ReturnValues.result, hostIDAndReplyCount),
      mm.deleteOne().from(cmt).whereSQL(updateConditions(cmt)),
      // host.cmtCount = host.cmtCount -replyCount - 1 (the comment itself)
      // The inputs of `updateCmtCountAction` are from the results of `cmtTA.getHostIDAndReplyCount`.
      updateCmtCountAction(ht, mm.sql`- ${mm.uInt().toInput(replyCount)} - 1`).wrap({
        replyCount: mm.valueRef(`${hostIDAndReplyCount}.ReplyCount`),
      }),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface);
}

export function insertReplyAction(ht: CmtHostTable): mm.TransactAction {
  return mm
    .transact(
      mm.insertOne().from(reply).setDefaults().setInputs().declareInsertedID(replyID),
      cmtTA.updateReplyCount.wrap({
        offset: '1',
        id: mm.valueRef(parentID),
      }),
      updateCmtCountAction(ht, 1),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(replyID);
}

export function deleteReplyAction(ht: CmtHostTable): mm.TransactAction {
  return mm
    .transact(
      replyTA.getParentID.declareReturnValue(mm.ReturnValues.result, parentID),
      mm.deleteOne().from(reply).whereSQL(updateConditions(reply)),
      updateCmtCountAction(ht, -1),
      cmtTA.updateReplyCount.wrap({
        offset: '-1',
        id: mm.valueRef(parentID),
      }),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface);
}
