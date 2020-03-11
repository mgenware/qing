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
import { Action } from 'mingru-models';
import replyTA from './replyTA';

const hostID = 'hostID';
const cmtID = 'cmtID';
const parentID = 'parentID';
const replyID = 'replyID';

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

export function updateCmtCountAction(
  pt: CmtHostTable,
  offset: number,
): mm.Action {
  return mm
    .updateOne()
    .from(pt)
    .set(pt.cmt_count, mm.sql`${pt.cmt_count} + ${mm.int().toInput('offset')}`)
    .where(updateConditions(pt, hostID))
    .wrap({ offset });
}

export function insertCmtAction(
  ht: CmtHostTable,
  rt: CmtRelationTable,
): mm.Action {
  return mm
    .transact(
      mm
        .insertOne()
        .from(cmt)
        .setDefaults()
        .setInputs()
        .declareInsertedID(cmtID),
      mm
        .insertOne()
        .from(rt)
        .setInputs()
        .wrapAsRefs({ cmtID }),
      updateCmtCountAction(ht, 1),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(cmtID);
}

export function deleteCmtAction(ht: CmtHostTable): Action {
  return mm
    .transact(
      cmtTA.getHostID.declareReturnValue(mm.ReturnValues.result, hostID),
      mm
        .deleteOne()
        .from(cmt)
        .where(updateConditions(cmt)),
      updateCmtCountAction(ht, -1),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface);
}

export function insertReplyAction(ht: CmtHostTable): mm.Action {
  return mm
    .transact(
      mm
        .insertOne()
        .from(reply)
        .setDefaults()
        .setInputs()
        .declareInsertedID(replyID),
      cmtTA.updateReplyCount.wrap({
        offset: 1,
        id: new mm.ValueRef(parentID),
      }),
      updateCmtCountAction(ht, 1),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(replyID);
}

export function deleteReplyAction(ht: CmtHostTable): Action {
  return mm
    .transact(
      replyTA.getParentID.declareReturnValue(mm.ReturnValues.result, parentID),
      mm
        .deleteOne()
        .from(reply)
        .where(updateConditions(reply)),
      updateCmtCountAction(ht, -1),
      cmtTA.updateReplyCount.wrap({
        offset: -1,
        id: new mm.ValueRef(parentID),
      }),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface);
}
