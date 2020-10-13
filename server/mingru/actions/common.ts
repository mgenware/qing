import * as mm from 'mingru-models';
import { TableWithUserID } from '../models/common';

export function defaultUpdateConditions(table: TableWithUserID, idInputName?: string): mm.SQL {
  return mm.and(
    mm.sql`${table.id.isEqualToInput(idInputName)}`,
    mm.sql`${table.user_id.isEqualToInput()}`,
  );
}

export function defaultBatchUpdateConditions(
  table: TableWithUserID,
  idsInputName?: string,
): mm.SQL {
  return mm.and(
    mm.sql`${table.id.isInArrayInput(idsInputName || 'ids')}`,
    mm.sql`${table.user_id.isEqualToInput()}`,
  );
}
