/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { TableWithIDAndUserID } from '../../models/common';
import { defaultUpdateConditions } from '../common';

export interface UpdateCounterActionOptions {
  offsetInputName?: string;
  idInputName?: string;
  whereSQL?: mm.SQL;
  rawOffsetSQL?: number | mm.SQL;
}

export function updateCounterAction(
  table: TableWithIDAndUserID,
  counterCol: mm.Column,
  opt?: UpdateCounterActionOptions,
): mm.UpdateAction {
  // eslint-disable-next-line no-param-reassign
  opt = opt || {};
  const { rawOffsetSQL } = opt;
  let offsetSQL: mm.SQL | string;
  if (rawOffsetSQL !== undefined) {
    if (rawOffsetSQL instanceof mm.SQL) {
      offsetSQL = rawOffsetSQL;
    } else {
      // Produce: `+ <offset>` or `- <offset>`.
      offsetSQL = rawOffsetSQL < 0 ? rawOffsetSQL.toString() : `+ ${rawOffsetSQL}`;
    }
    offsetSQL = mm.sql`${counterCol} ${offsetSQL}`;
  } else {
    offsetSQL = mm.sql`${counterCol} + ${mm.int().toInput(opt.offsetInputName || 'offset')}`;
  }
  return mm
    .updateOne()
    .from(table)
    .set(counterCol, offsetSQL)
    .whereSQL(opt.whereSQL ? opt.whereSQL : defaultUpdateConditions(table, opt.idInputName));
}
