import * as mm from 'mingru-models';

export interface CmtSourceTable extends mm.Table {
  id: mm.Column;
  user_id: mm.Column;
  cmt_count: mm.Column;
}

export function updateConditions(
  table: Omit<CmtSourceTable, 'cmt_count'>,
): mm.SQL {
  return mm.and(
    mm.sql`${table.id.isEqualToInput()}`,
    mm.sql`${table.user_id.isEqualToInput()}`,
  );
}

export const cmtInterface = 'CmtCore';
export const cmtResultType = 'CmtData';

export interface CmtRelationTable extends mm.Table {
  cmt_id: mm.Column;
  target_id: mm.Column;
}
