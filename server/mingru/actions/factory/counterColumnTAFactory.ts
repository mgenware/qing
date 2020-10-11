import * as mm from 'mingru-models';
import { TableWithUserID } from '../../models/factory/common';
import { defaultUpdateConditions } from './common';

export function updateCounterAction(
  table: TableWithUserID,
  counterCol: mm.Column,
  offset: number | mm.SQL,
  idInputName?: string,
): mm.Action {
  let offsetExpr: mm.SQL | string;
  if (offset instanceof mm.SQL) {
    offsetExpr = offset;
  } else {
    // Produce `+ <offset>` or `- <offset>`.
    offsetExpr = offset < 0 ? offset.toString() : `+ ${offset}`;
  }
  return mm
    .updateOne()
    .from(table)
    .set(counterCol, mm.sql`${counterCol} ${offsetExpr}`)
    .whereSQL(defaultUpdateConditions(table, idInputName));
}
