import * as mm from 'mingru-models';
import { cmt, reply } from '../models/cmt';
import user from '../models/user';
import * as cm from '../models/common';
import cmtTA from './cmtTA';
import {
  CmtRelationTable,
  cmtInterface,
  cmtResultType,
  CmtSourceTable,
  updateConditions,
} from './cmtTAUtils';
import { Action } from 'mingru-models';

const id = 'id';
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
    .by(rt.target_id)
    .orderByDesc(jCmt.created_at)
    .attrs({
      [mm.ActionAttributes.groupTypeName]: cmtInterface,
      [mm.ActionAttributes.resultTypeName]: cmtResultType,
    });
}

export function updateCmtCountAction(
  st: CmtSourceTable,
  offset: number,
  idVariable: string,
): mm.Action {
  return mm
    .updateOne()
    .from(st)
    .set(st.cmt_count, mm.sql`${st.cmt_count} + ${mm.int().toInput('offset')}`)
    .where(updateConditions(st))
    .wrap({ offset, id: mm.valueRef(idVariable) });
}

export function insertCmtAction(
  st: CmtSourceTable,
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
      updateCmtCountAction(st, 1, cmtID),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(cmtID);
}

export function deleteCmtAction(st: CmtSourceTable): Action {
  return mm.transact(
    mm
      .deleteOne()
      .from(cmt)
      .where(updateConditions(cmt)),
    updateCmtCountAction(st, -1, id),
  );
}

export function insertReplyAction(st: CmtSourceTable): mm.Action {
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
      updateCmtCountAction(st, 1, replyID),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(replyID);
}
