/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { cmt as t } from '../../models/cmt/cmt';
import * as cm from '../../models/common';
import { getEntitySrcType } from '../defs';
import { defaultUpdateConditions } from '../common';

// Most cmt/reply-related funcs are built into the host table itself.
// Those in `CmtTA` are ones don't rely on `host.cmt_count`.
export class CmtTA extends mm.TableActions {
  editCmt = mm
    .updateOne()
    .setInputs(t.content)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultUpdateConditions(t));

  selectCmtSource = mm
    .selectRow(t.content)
    .whereSQL(defaultUpdateConditions(t))
    .resultTypeNameAttr(getEntitySrcType);

  updateReplyCount = mm
    .updateOne()
    .set(t.reply_count, mm.sql`${t.reply_count} + ${mm.int().toInput('offset')}`)
    .whereSQL(defaultUpdateConditions(t));
}

export default mm.tableActions(t, CmtTA);
