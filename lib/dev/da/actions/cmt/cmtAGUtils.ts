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
import { getLikedColFromEntityID } from '../com/likeUtil.js';

export interface CmtHostTable extends TableWithIDAndUserID {
  cmt_count: mm.Column;
}

export const cmtHostTableInterface = 'CmtHostTableInterface';
export const cmtResultType = 'CmtResult';

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
    jCmt.cmt_count,
    jCmt.likes,
    jCmt.user_id.privateAttr(),
    jCmt.user_id.join(user).name,
    jCmt.user_id.join(user).icon_name.privateAttr(),
  ];
  if (opt.fetchLikes) {
    cols.push(getLikedColFromEntityID(opt.rt ? opt.rt.cmt_id : cmt.id, cmtLike));
  }

  const orderByFollowingCols = {
    // Sort by `created_at` DESC if `likes` are the same.
    [jCmt.likes.__getPath()]: [new mm.OrderByColumn(jCmt.created_at, true)],
    // Sort by `likes` DESC if `created_at` are the same.
    [jCmt.created_at.__getPath()]: [new mm.OrderByColumn(jCmt.likes, true)],
  };
  return mm
    .selectRows(...cols)
    .from(opt.rt ? opt.rt : cmt)
    .pageMode()
    .by(opt.rt ? opt.rt.host_id : cmt.parent_id)
    .orderByParams([jCmt.likes, jCmt.created_at], orderByFollowingCols)
    .attr(mm.ActionAttribute.groupTypeName, cmtHostTableInterface)
    .resultTypeNameAttr(cmtResultType)
    .attr(mm.ActionAttribute.enableTSResultType, true);
}
