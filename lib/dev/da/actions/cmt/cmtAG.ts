/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { cmt as t } from '../../models/cmt/cmt.js';
import * as cm from '../../models/common.js';
import { getEntitySrcType } from '../defs.js';
import { defaultUpdateConditions } from '../common.js';
import { getSelectCmtsAction } from './cmtAGUtils.js';
import { updateCounterAction } from '../com/updateCounterAction.js';

// Most cmt/reply-related funcs are built into the host table itself.
// Those in `CmtTA` are ones don't rely on `host.cmt_count`.
export class CmtAG extends mm.ActionGroup {
  selectCmtSource = mm
    .selectRow(t.content)
    .whereSQL(defaultUpdateConditions(t))
    .resultTypeNameAttr(getEntitySrcType)
    .attr(mm.ActionAttribute.enableTSResultType, true);
  selectReplySource = mm
    .selectRow(t.content)
    .whereSQL(defaultUpdateConditions(t))
    .resultTypeNameAttr(getEntitySrcType);

  selectHostInfo = mm.selectRow(t.host_id, t.host_type).by(t.id);

  memLockedGetCmtDataForDeletion = mm
    .selectRow(t.parent_id, t.cmt_count)
    .by(t.id)
    .lock(mm.SelectActionLockMode.inShareMode);

  selectReplies: mm.SelectAction;
  selectRepliesWithLikes: mm.SelectAction;

  editCmt = mm
    .updateOne()
    .setParams(t.content, t.modified_at)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultUpdateConditions(t));
  editReply = mm
    .updateOne()
    .setParams(t.modified_at, t.content)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultUpdateConditions(t));

  updateReplyCount = updateCounterAction(t, t.cmt_count);

  insertCmt = mm.insertOne().set(t.parent_id, mm.constants.NULL).setDefaults().setParams();
  // `parent_id` is required when inserting a reply.
  insertReply = mm
    .insertOne()
    .set(
      t.parent_id,
      new mm.SQLVariable(t.parent_id.__type(), t.parent_id.__getDBName(), false, undefined, false),
    )
    .setDefaults()
    .setParams();
  deleteCore = mm.deleteOne().whereSQL(defaultUpdateConditions(t));

  eraseCmt = mm
    .updateOne()
    .setParams(t.del_flag)
    .set(t.content, '')
    .whereSQL(defaultUpdateConditions(t));

  constructor() {
    super();
    this.selectReplies = getSelectCmtsAction({ rt: null, fetchLikes: false });
    this.selectRepliesWithLikes = getSelectCmtsAction({ rt: null, fetchLikes: true });
  }
}

export default mm.actionGroup(t, CmtAG);