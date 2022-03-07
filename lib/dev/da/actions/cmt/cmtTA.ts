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
import { getSelectCmtsAction } from './cmtTAUtils.js';
import { updateCounterAction } from '../com/updateCounterAction.js';

// Most cmt/reply-related funcs are built into the host table itself.
// Those in `CmtTA` are ones don't rely on `host.cmt_count`.
export class CmtTA extends mm.TableActions {
  editCmt = mm
    .updateOne()
    .setInputs(t.content, t.modified_at)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultUpdateConditions(t));

  selectCmtSource = mm
    .selectRow(t.content)
    .whereSQL(defaultUpdateConditions(t))
    .resultTypeNameAttr(getEntitySrcType)
    .attr(mm.ActionAttribute.enableTSResultType, true);

  updateReplyCount = updateCounterAction(t, t.reply_count);

  memLockedGetCmtDataForDeletion = mm
    .selectRow(t.parent_id, t.reply_count)
    .by(t.id)
    .lock(mm.SelectActionLockMode.inShareMode);

  selectReplies: mm.SelectAction;
  selectRepliesWithLike: mm.SelectAction;

  editReply = mm
    .updateOne()
    .setInputs(t.content, t.modified_at)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultUpdateConditions(t));
  selectReplySource = mm
    .selectRow(t.content)
    .whereSQL(defaultUpdateConditions(t))
    .resultTypeNameAttr(getEntitySrcType);
  insertCmt = mm.insertOne().set(t.parent_id, mm.constants.NULL).setDefaults().setInputs();
  // `parent_id` is required when inserting a reply.
  insertReply = mm
    .insertOne()
    .set(
      t.parent_id,
      new mm.SQLVariable(t.parent_id.__type(), t.parent_id.__getDBName(), false, undefined, false),
    )
    .setDefaults()
    .setInputs();
  deleteCore = mm.deleteOne().whereSQL(defaultUpdateConditions(t));

  eraseCmt = mm
    .updateOne()
    .setInputs(t.del_flag)
    .set(t.content, '')
    .whereSQL(defaultUpdateConditions(t));

  constructor() {
    super();
    this.selectReplies = getSelectCmtsAction({ rt: null, fetchLikes: false });
    this.selectRepliesWithLike = getSelectCmtsAction({ rt: null, fetchLikes: true });
  }
}

export default mm.tableActions(t, CmtTA);
