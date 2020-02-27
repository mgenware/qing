import * as mm from 'mingru-models';
import { cmt, reply } from '../models/cmt';
import user from '../models/user';
import * as cm from '../models/common';
import cmtTA from './cmtTA';
import {
  CmtRelationTable,
  cmtInterface,
  cmtResultType,
  CmtPostTable,
  updateConditions,
} from './cmtTAUtils';
import { Action } from 'mingru-models';

const postID = 'postID';
const cmtID = 'cmtID';
const replyID = 'replyID';

export function selectCmts(rt: CmtRelationTable): mm.SelectAction {
  const jCmt = rt.cmt_id.associativeJoin(cmt);
  return mm
    .selectPage(
      rt.cmt_id.privateAttr(),
      jCmt.content,
      jCmt.created_at,
      jCmt.modified_at,
      jCmt.rpl_count,
      jCmt.user_id.privateAttr(),
      jCmt.user_id.join(user).name,
      jCmt.user_id.join(user).icon_name.privateAttr(),
    )
    .from(rt)
    .by(rt.post_id)
    .orderByDesc(jCmt.created_at)
    .attrs({
      [mm.ActionAttributes.groupTypeName]: cmtInterface,
      [mm.ActionAttributes.resultTypeName]: cmtResultType,
    });
}

export function updateCmtCountAction(
  pt: CmtPostTable,
  offset: number,
  idVariable: string,
): mm.Action {
  return mm
    .updateOne()
    .from(pt)
    .set(pt.cmt_count, mm.sql`${pt.cmt_count} + ${mm.int().toInput('offset')}`)
    .where(updateConditions(pt))
    .wrap({ offset, id: mm.valueRef(idVariable) });
}

export function insertCmtAction(
  pt: CmtPostTable,
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
      updateCmtCountAction(pt, 1, postID),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(cmtID);
}

export function deleteCmtAction(pt: CmtPostTable): Action {
  return mm
    .transact(
      cmtTA.getPostID.declareReturnValue(mm.ReturnValues.result, postID),
      mm
        .deleteOne()
        .from(cmt)
        .where(updateConditions(cmt)),
      updateCmtCountAction(pt, -1, postID),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface);
}

export function insertReplyAction(pt: CmtPostTable): mm.Action {
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
        id: new mm.ValueRef(replyID),
      }),
      updateCmtCountAction(pt, 1, replyID),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(replyID);
}
