/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

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
