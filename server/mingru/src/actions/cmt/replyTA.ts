/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { reply as t } from '../../models/cmt/cmt.js';
import * as cm from '../../models/common.js';
import user from '../../models/user/user.js';
import { cmtResultType, hasLikedProp, replyInterface, viewerUserIDInput } from './cmtTAUtils.js';
import { defaultUpdateConditions } from '../common.js';
import { getEntitySrcType } from '../defs.js';
import { replyLike } from '../../models/like/likeableTables.js';

export class ReplyTA extends mm.TableActions {
  selectReplies: mm.SelectAction;
  selectRepliesWithLike: mm.SelectAction;

  editReply = mm
    .updateOne()
    .setInputs(t.content)
    .argStubs(cm.sanitizedStub)
    .whereSQL(defaultUpdateConditions(t));
  selectReplySource = mm
    .selectRow(t.content)
    .whereSQL(defaultUpdateConditions(t))
    .resultTypeNameAttr(getEntitySrcType);
  insertReplyCore = mm.insertOne().setDefaults().setInputs();
  deleteReplyCore = mm.deleteOne().whereSQL(defaultUpdateConditions(t));

  constructor() {
    super();
    this.selectReplies = this.getSelectRepliesAction(false);
    this.selectRepliesWithLike = this.getSelectRepliesAction(true);
  }

  private getSelectRepliesAction(withLike: boolean): mm.SelectAction {
    const cols: mm.SelectedColumn[] = [
      t.id.privateAttr(),
      t.content,
      t.created_at,
      t.modified_at,
      t.likes,
      t.user_id.privateAttr(),
      t.to_user_id.privateAttr(),
      t.user_id.join(user).name,
      t.user_id.join(user).icon_name.privateAttr(),
      t.to_user_id.join(user).name,
    ];

    if (withLike) {
      const likeUserID = t.id.leftJoin(
        replyLike,
        replyLike.host_id,
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

export default mm.tableActions(t, ReplyTA);
