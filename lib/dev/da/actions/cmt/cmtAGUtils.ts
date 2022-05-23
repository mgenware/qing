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
  // If present, select root cmts.
  // Otherwise, select replies.
  rt: CmtRelationTable | null;
  // Whether likes of a specific user are fetched. User mode only.
  userMode: boolean;
  // Whether some cmts are excluded. Used when loading more cmts with dynamically added cmts
  // on web side. User mode only.
  filterMode: boolean;
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
  if (opt.userMode) {
    cols.push(getLikedColFromEntityID(opt.rt ? opt.rt.cmt_id : jCmt.id, cmtLike));
  }

  const orderByFollowingCols = {
    // Sort by `created_at` DESC if `likes` are the same.
    [jCmt.likes.__getPath()]: [new mm.OrderByColumn(jCmt.created_at, true)],
    // Sort by `likes` DESC if `created_at` are the same.
    [jCmt.created_at.__getPath()]: [new mm.OrderByColumn(jCmt.likes, true)],
  };

  let whereSQL = mm.sql`${(opt.rt ? opt.rt.host_id : jCmt.parent_id).isEqualToParam()}`;
  if (opt.filterMode) {
    whereSQL = mm.and(whereSQL, mm.sql`${jCmt.id} NOT IN ${jCmt.id.toArrayParam('excluded')}`);
  }

  return mm
    .selectRows(...cols)
    .from(opt.rt ? opt.rt : cmt)
    .pageMode()
    .whereSQL(whereSQL)
    .orderByParams([jCmt.likes, jCmt.created_at], orderByFollowingCols)
    .orderByAsc(jCmt.id)
    .attr(mm.ActionAttribute.groupTypeName, cmtHostTableInterface)
    .resultTypeNameAttr(cmtResultType)
    .attr(mm.ActionAttribute.enableTSResultType, true);
}
