/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { TableWithIDAndUserID } from '../../models/common.js';
import user from '../../models/user/user.js';
import cmt from '../../models/cmt/cmt.js';
import { cmtLike } from '../../models/like/likeableTables.js';

export interface CmtHostTable extends TableWithIDAndUserID {
  cmt_count: mm.Column;
}

export const cmtInterface = 'CmtInterface';
export const cmtResultType = 'CmtData';
export const replyInterface = 'ReplyInterface';
export const hasLikedProp = 'hasLiked';
export const viewerUserIDInput = 'viewerUserID';

export interface CmtRelationTable extends mm.Table {
  cmt_id: mm.Column;
  host_id: mm.Column;
}

export function getSelectCmtsAction(opt: {
  // If present, it's selecting root cmts.
  // Otherwise, it's selecting replies.
  rt: CmtRelationTable | null;
  fetchLikes: boolean;
}): mm.SelectAction {
  const jCmt = opt.rt ? opt.rt.cmt_id.associativeJoin(cmt) : cmt;
  const cols: mm.SelectedColumnTypes[] = [
    opt.rt ? opt.rt.cmt_id.as('id').privateAttr() : jCmt.id.privateAttr(),
    jCmt.content,
    jCmt.created_at.privateAttr(),
    jCmt.modified_at.privateAttr(),
    jCmt.reply_count,
    jCmt.likes,
    jCmt.user_id.privateAttr(),
    jCmt.user_id.join(user).name,
    jCmt.user_id.join(user).icon_name.privateAttr(),
  ];
  if (opt.fetchLikes) {
    const likeUserID = (opt.rt ? opt.rt.cmt_id : cmt.id).leftJoin(
      cmtLike,
      cmtLike.host_id,
      undefined,
      (jt) => mm.sql`AND ${jt.user_id.isEqualToInput(viewerUserIDInput)}`,
    ).user_id;
    cols.push(likeUserID.as(hasLikedProp));
  }
  return mm
    .selectRows(...cols)
    .from(opt.rt ? opt.rt : cmt)
    .pageMode()
    .by(opt.rt ? opt.rt.host_id : cmt.parent_id)
    .orderByDesc(jCmt.created_at)
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface)
    .resultTypeNameAttr(cmtResultType)
    .attr(mm.ActionAttribute.tsTypeName, cmtResultType);
}
