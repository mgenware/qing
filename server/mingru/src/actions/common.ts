import * as mm from 'mingru-models';
import { TableWithIDAndUserID } from '../models/common';

export function defaultUpdateConditions(table: TableWithIDAndUserID, idInputName?: string): mm.SQL {
  return mm.and(
    mm.sql`${table.id.isEqualToInput(idInputName)}`,
    mm.sql`${table.user_id.isEqualToInput()}`,
  );
}

export function defaultBatchUpdateConditions(
  table: TableWithIDAndUserID,
  idsInputName?: string,
): mm.SQL {
  return mm.and(
    mm.sql`${table.id.isInArrayInput(idsInputName || 'ids')}`,
    mm.sql`${table.user_id.isEqualToInput()}`,
  );
}

export const UserThreadInterface = 'UserThreadInterface';
export const UserThreadTypeColumnName = 'threadType';
export const UserThreadValue1ColumnName = 'value1';
