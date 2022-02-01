/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { cmt as t } from '../../models/cmt/cmt.js';
import user from '../../models/user/user.js';
import * as cm from '../../models/common.js';
import { getEntitySrcType } from '../defs.js';
import { defaultUpdateConditions } from '../common.js';
import { cmtLike } from '../../models/like/likeableTables.js';
import { cmtResultType, hasLikedProp, replyInterface, viewerUserIDInput } from './cmtTAUtils.js';

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
    .resultTypeNameAttr(getEntitySrcType);

  // DO NOT add `user_id` check here since parent cmt's `reply_count` might be a different user.
  updateReplyCount = mm
    .updateOne()
    .set(t.reply_count, mm.sql`${t.reply_count} + ${mm.int().toInput('offset')}`)
    .by(t.id);

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
  insertCmt = mm.insertOne().set(t.parent_id, 'NULL').setDefaults().setInputs();
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

  constructor() {
    super();
    this.selectReplies = this.getSelectRepliesAction(false);
    this.selectRepliesWithLike = this.getSelectRepliesAction(true);
  }

  private getSelectRepliesAction(withLike: boolean): mm.SelectAction {
    const cols: mm.SelectedColumnTypes[] = [
      t.id.privateAttr(),
      t.content,
      t.created_at.privateAttr(),
      t.modified_at.privateAttr(),
      t.likes,
      t.user_id.privateAttr(),
      t.user_id.join(user).name,
      t.user_id.join(user).icon_name.privateAttr(),
    ];

    if (withLike) {
      const likeUserID = t.id.leftJoin(
        cmtLike,
        cmtLike.host_id,
        undefined,
        (jt) => mm.sql`AND ${jt.user_id.isEqualToInput(viewerUserIDInput)}`,
      ).user_id;
      cols.push(likeUserID.as(hasLikedProp));
    }

    return mm
      .selectRows(...cols)
      .pageMode()
      .by(t.parent_id)
      .orderByDesc(t.created_at)
      .attr(mm.ActionAttribute.groupTypeName, replyInterface)
      .resultTypeNameAttr(cmtResultType);
  }
}

export default mm.tableActions(t, CmtTA);
