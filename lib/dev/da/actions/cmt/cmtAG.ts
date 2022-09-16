/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { cmt as t } from '../../models/cmt/cmt.js';
import * as cm from '../../models/common.js';
import { getEntitySrcType } from '../def.js';
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
    .lock(mm.SelectActionLockMode.forUpdate);

  selectReplies: mm.SelectAction;
  selectRepliesUserMode: mm.SelectAction;
  selectRepliesUserModeFilterMode: mm.SelectAction;

  editCmt = mm
    .updateOne()
    .setDefaults(t.modified_at)
    .setParams(t.content)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultUpdateConditions(t));
  editReply = mm
    .updateOne()
    .setDefaults(t.modified_at)
    .setParams(t.content)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultUpdateConditions(t));

  updateReplyCount = updateCounterAction(t, t.cmt_count);

  // Used as a TX member, and thus has `.from` called.
  insertCmtTXM = mm
    .insertOne()
    .from(t)
    .set(t.parent_id, mm.constants.NULL)
    .setDefaults()
    .set(t.modified_at, t.created_at)
    .setParams();
  // `parent_id` is required when inserting a reply.
  // Used as a TX member, and thus has `.from` called.
  insertReplyTXM = mm
    .insertOne()
    .from(t)
    .set(
      t.parent_id,
      new mm.SQLVariable(t.parent_id.__type(), t.parent_id.__getDBName(), false, undefined, false),
    )
    .setDefaults()
    .set(t.modified_at, t.created_at)
    .setParams();
  deleteCore = mm.deleteOne().whereSQL(defaultUpdateConditions(t));

  eraseCmt = mm
    .updateOne()
    .setParams(t.del_flag)
    .set(t.content, '""')
    .whereSQL(defaultUpdateConditions(t));

  constructor() {
    super();
    this.selectReplies = getSelectCmtsAction({ rt: null, userMode: false, filterMode: false });
    this.selectRepliesUserMode = getSelectCmtsAction({
      rt: null,
      userMode: true,
      filterMode: false,
    });
    this.selectRepliesUserModeFilterMode = getSelectCmtsAction({
      rt: null,
      userMode: true,
      filterMode: true,
    });
  }
}

export default mm.actionGroup(t, CmtAG);
