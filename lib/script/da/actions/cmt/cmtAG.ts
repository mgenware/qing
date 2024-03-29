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
import { getSelectCmtsAction, getSelectCmtAction } from './cmtAGUtils.js';
import { updateCounterAction } from '../com/updateCounterAction.js';

function defaultCmtUpdateConditions() {
  return defaultUpdateConditions(t, { userIDParamOpt: { nullable: false } });
}

// Most cmt/reply-related funcs are built into the host table itself.
// Those in `CmtTA` are ones don't rely on `host.cmt_count`.
export class CmtAG extends mm.ActionGroup {
  selectCmtSource = mm
    .selectRow(t.content, t.content_src)
    .whereSQL(defaultCmtUpdateConditions())
    .resultTypeNameAttr(getEntitySrcType)
    .attr(mm.ActionAttribute.enableTSResultType, true);
  selectReplySource = mm
    .selectRow(t.content, t.content_src)
    .whereSQL(defaultCmtUpdateConditions())
    .resultTypeNameAttr(getEntitySrcType);

  selectHostInfo = mm.selectRow(t.host_id, t.host_type).by(t.id);
  selectUserID = mm.selectField(t.user_id).by(t.id);

  // Used in focused cmt mode, where a single cmt along with its parent are shown.
  selectCmt: mm.SelectAction;
  selectCmtUserMode: mm.SelectAction;

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
    .whereSQL(defaultCmtUpdateConditions());

  editReply = mm
    .updateOne()
    .setDefaults(t.modified_at)
    .setParams(t.content)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultCmtUpdateConditions());

  updateReplyCount = updateCounterAction(t, t.cmt_count);

  devUpdateCreated: mm.UpdateAction;
  devUpdateModified: mm.UpdateAction;

  // Used as a TX member, and thus has `.from` called.
  insertCmtTXM = mm
    .insertOne()
    .from(t)
    .set(t.parent_id, mm.constants.NULL)
    .set(t.user_id, t.user_id.toParamNotNull())
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
    .set(t.user_id, t.user_id.toParamNotNull())
    .setDefaults()
    .set(t.modified_at, t.created_at)
    .setParams();
  deleteCore = mm.deleteOne().whereSQL(defaultCmtUpdateConditions());

  eraseCmt = mm
    .updateOne()
    .setParams(t.del_flag)
    .set(t.user_id, mm.constants.NULL)
    .set(t.content, '""')
    .whereSQL(defaultCmtUpdateConditions());

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

    this.selectCmt = getSelectCmtAction({ userMode: false });
    this.selectCmtUserMode = getSelectCmtAction({ userMode: true });

    this.devUpdateCreated = mm.updateOne().setParams(t.created_at, t.modified_at).by(t.id);
    this.devUpdateModified = mm.updateOne().setParams(t.modified_at).by(t.id);
  }
}

export default mm.actionGroup(t, CmtAG);
