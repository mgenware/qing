import * as mm from 'mingru-models';
import * as mr from 'mingru';
import cmt from '../models/cmt';
import user from '../models/user';
import * as cm from '../models/common';

const cmtInterface = 'CmtCore';
const cmtResultType = 'SelectCmtResult';

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
      jCmt.content,
      jCmt.created_at,
      jCmt.modified_at,
      jCmt.rpl_count,
      jCmt.user_id.attrs({ [mr.ColumnAttributes.jsonIgnore]: true }),
      jCmt.user_id.join(user).name,
      jCmt.user_id
        .join(user)
        .icon_name.attrs({ [mr.ColumnAttributes.jsonIgnore]: true }),
    )
    .from(rt)
    .by(rt.target_id)
    .orderByDesc(jCmt.created_at)
    .attrs({
      [mr.ActionAttributes.interfaceName]: cmtInterface,
      [mr.ActionAttributes.resultName]: cmtResultType,
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
    .attr(mr.ActionAttributes.interfaceName, cmtInterface)
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
