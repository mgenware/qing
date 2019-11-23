import * as mm from 'mingru-models';
import * as mr from 'mingru';
import cmt from '../models/cmt';
import user from '../models/user';

const cmtInterface = 'CmtCore';
const cmtResultType = 'SelectCmtResult';

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
        .setInputs(),
      mm
        .insertOne()
        .from(rt)
        .setInputs(),
    )
    .attrs({
      [mr.ActionAttributes.interfaceName]: cmtInterface,
    });
}
