/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { TableWithIDAndUserID } from '../../models/common.js';

export const offsetParamName = 'offset';

export interface UpdateCounterActionOptions {
  offsetInputName?: string;
  idInputName?: string;
  whereSQL?: mm.SQL;
  offsetNumber?: number;
  offsetSQL?: mm.SQL;
}

export function updateCounterAction(
  table: TableWithIDAndUserID,
  counterCol: mm.Column,
  opt?: UpdateCounterActionOptions,
): mm.UpdateAction {
  // eslint-disable-next-line no-param-reassign
  opt = opt || {};
  let offsetSQL: mm.SQL | string;
  if (opt.offsetSQL) {
    // eslint-disable-next-line prefer-destructuring
    offsetSQL = opt.offsetSQL;
  } else if (opt.offsetNumber) {
    offsetSQL = mm.sql`${opt.offsetNumber < 0 ? '-' : '+'} ${Math.abs(
      opt.offsetNumber,
    ).toString()}`;
  } else {
    offsetSQL = mm.sql`+ ${mm.int().toInput(opt.offsetInputName || offsetParamName)}`;
  }

  offsetSQL = mm.sql`${counterCol} ${offsetSQL}`;
  return mm
    .updateOne()
    .from(table)
    .set(counterCol, offsetSQL)
    .whereSQL(opt.whereSQL ? opt.whereSQL : mm.sql`${table.id.isEqualToInput(opt.idInputName)}`);
}
