import * as mm from 'mingru-models';
import { TableWithUserID } from '../../models/common';

export interface CmtHostTable extends TableWithUserID {
  cmt_count: mm.Column;
}

export const cmtInterface = 'CmtInterface';
export const cmtResultType = 'CmtData';
export const replyInterface = 'ReplyInterface';
export const replyResultType = 'ReplyData';

export interface CmtRelationTable extends mm.Table {
  cmt_id: mm.Column;
  host_id: mm.Column;
}
