import * as mm from 'mingru-models';

export interface CmtHostTable extends mm.Table {
  id: mm.Column;
  user_id: mm.Column;
  cmt_count: mm.Column;
}

export function updateConditions(
  table: Omit<CmtHostTable, 'cmt_count'>,
): mm.SQL {
  return mm.and(
    mm.sql`${table.id.isEqualToInput()}`,
    mm.sql`${table.user_id.isEqualToInput()}`,
  );
}

export const cmtInterface = 'CmtInterface';
export const cmtResultType = 'CmtData';
export const replyInterface = 'ReplyInterface';
export const replyResultType = 'ReplyData';

export interface CmtRelationTable extends mm.Table {
  cmt_id: mm.Column;
  host_id: mm.Column;
}
