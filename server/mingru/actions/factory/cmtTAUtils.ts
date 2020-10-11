import * as mm from 'mingru-models';
import { TableWithUserID } from '../../models/factory/common';

export interface CmtHostTable extends TableWithUserID {
  cmt_count: mm.Column;
}

export function updateConditions(
  table: Omit<CmtHostTable, 'cmt_count'>,
  idInputName?: string,
): mm.SQL {
  return mm.and(
    mm.sql`${table.id.isEqualToInput(idInputName)}`,
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
