import * as mm from 'mingru-models';
import cmt from '../models/cmt';
import user from '../models/user';

export interface CmtRelationTable extends mm.Table {
  cmt_id: mm.Column;
  getTargetID(): mm.Column;
}

export function selectCmts(rt: CmtRelationTable): mm.SelectAction {
  const jCmt = rt.cmt_id.associativeJoin(cmt);
  return mm
    .select(
      jCmt.content,
      jCmt.created_at,
      jCmt.modified_at,
      jCmt.rpl_count,
      jCmt.user_id,
      jCmt.user_id.join(user).name,
    )
    .from(rt)
    .by(rt.getTargetID());
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
