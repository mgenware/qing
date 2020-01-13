import * as mm from 'mingru-models';
import cmt from '../models/cmt';
import user from '../models/user';
import * as cm from '../models/common';

const cmtInterface = 'CmtCore';
const cmtResultType = 'CmtData';

const updateConditions = mm.and(
  mm.sql`${cmt.id.isEqualToInput()}`,
  mm.sql`${cmt.user_id.isEqualToInput()}`,
);

export interface CmtRelationTable extends mm.Table {
  cmt_id: mm.Column;
  target_id: mm.Column;
}

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

export function insertCmt(rt: CmtRelationTable): mm.Action {
  return mm
    .transact(
      mm
        .insertOne()
        .from(cmt)
        .setDefaults()
        .setInputs()
        .declareInsertedID('cmtID'),
      mm
        .insertOne()
        .from(rt)
        .setInputs()
        .wrapAsRefs({ cmtID: 'cmtID' }),
    )
    .attr(mm.ActionAttributes.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues('cmtID');
}

export function editCmt(): mm.Action {
  return mm
    .updateOne()
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setInputs(cmt.content)
    .where(updateConditions);
}
