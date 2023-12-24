/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { TableWithIDAndUserID } from '../models/common.js';

export interface UpdateConditionOptions {
  idInputName?: string;
  userIDParamName?: string;
  userIDParamOpt?: mm.ParamAttributes;
}

export interface BatchUpdateConditionOptions {
  idsInputName?: string;
  userIDParamName?: string;
  userIDParamOpt?: mm.ParamAttributes;
}

export function defaultUpdateConditions(
  table: TableWithIDAndUserID,
  opt?: UpdateConditionOptions,
): mm.SQL {
  return mm.and(
    mm.sql`${table.id.isEqualToParam(opt?.idInputName)}`,
    mm.sql`${table.user_id.isEqualToParam(opt?.userIDParamName, opt?.userIDParamOpt)}`,
  );
}

export function defaultBatchUpdateConditions(
  table: TableWithIDAndUserID,
  opt?: BatchUpdateConditionOptions,
): mm.SQL {
  return mm.and(
    mm.sql`${table.id.isInArrayParam(opt?.idsInputName ?? 'ids')}`,
    mm.sql`${table.user_id.isEqualToParam(opt?.userIDParamName, opt?.userIDParamOpt)}`,
  );
}
