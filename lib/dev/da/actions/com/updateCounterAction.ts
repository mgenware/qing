/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { TableWithID } from '../../models/common.js';

const offsetParamName = 'offset';

export function updateCounterAction(table: TableWithID, counterCol: mm.Column) {
  const valueSQL = mm.sql`${counterCol} + ${mm.int().toParam(offsetParamName)}`;
  const whereSQL = mm.sql`${table.id.isEqualToParam()}`;
  return mm.updateOne().set(counterCol, valueSQL).whereSQL(whereSQL);
}

function callUpdateCounterAction(action: mm.UpdateAction, offset: number) {
  return action.wrap({
    [offsetParamName]: offset,
  });
}

export function incrementCounter(action: mm.UpdateAction) {
  return callUpdateCounterAction(action, 1);
}

export function decrementCounter(action: mm.UpdateAction) {
  return callUpdateCounterAction(action, -1);
}
