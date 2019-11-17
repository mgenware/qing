import * as mm from 'mingru-models';
import * as mr from 'mingru';
import cmt from '../models/cmt';
import user from '../models/user';

export interface CmtRelationTable extends mm.Table {
  cmt_id: mm.Column;
  getTargetID(): mm.Column;
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
    .by(rt.getTargetID())
    .orderByDesc(jCmt.created_at);
}

export function insertCmt(rt: CmtRelationTable): mm.Action {
  return mm.transact(
    mm
      .insertOne()
      .from(cmt)
      .setInputs(),
    mm
      .insertOne()
      .from(rt)
      .setInputs(),
  );
}
