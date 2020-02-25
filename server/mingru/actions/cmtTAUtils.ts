import * as mm from 'mingru-models';

export interface CmtSourceTable {
  id: mm.Column;
  user_id: mm.Column;
}

export function updateConditions(table: CmtSourceTable): mm.SQL {
  return mm.and(
    mm.sql`${table.id.isEqualToInput()}`,
    mm.sql`${table.user_id.isEqualToInput()}`,
  );
}
