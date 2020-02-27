import * as mm from 'mingru-models';

export interface CmtPostTable extends mm.Table {
  id: mm.Column;
  user_id: mm.Column;
  cmt_count: mm.Column;
}

export function updateConditions(
  table: Omit<CmtPostTable, 'cmt_count'>,
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
  post_id: mm.Column;
}
