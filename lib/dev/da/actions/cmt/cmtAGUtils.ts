/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { TableWithIDAndUserID } from '../../models/common.js';
import user, { User } from '../../models/user/user.js';
import cmt, { Cmt } from '../../models/cmt/cmt.js';
import { cmtLike } from '../../models/like/likeableTables.js';
import { getLikedColFromEntityID } from '../com/likeUtil.js';

export interface CmtHostTable extends TableWithIDAndUserID {
  cmt_count: mm.Column;
}

export const cmtHostTableInterface = 'CmtHostTableInterface';
export const cmtResultType = 'DBCmt';

export interface CmtRelationTable extends mm.Table {
  cmt_id: mm.Column;
  host_id: mm.Column;
}

export function getCmtCols(cmtTable: Cmt, userTable: User): mm.SelectedColumnTypes[] {
  return [
    cmtTable.content,
    cmtTable.created_at.privateAttr(),
    cmtTable.modified_at.privateAttr(),
    cmtTable.cmt_count,
    cmtTable.likes,
    cmtTable.del_flag,
    cmtTable.user_id.privateAttr(),
    cmtTable.parent_id.privateAttr(),
    userTable.name,
    userTable.icon_name.privateAttr(),
  ];
}

export function getSelectCmtAction(opt: {
  // Fetches likes if true.
  userMode: boolean;
}) {
  const jUser = cmt.user_id.leftJoin(user);
  const cols: mm.SelectedColumnTypes[] = [
    cmt.id.privateAttr(),
    ...getCmtCols(cmt, jUser),
    cmt.host_id,
    cmt.host_type,
  ];
  if (opt.userMode) {
    cols.push(getLikedColFromEntityID(cmt.id, cmtLike));
  }
  return mm
    .select(...cols)
    .from(cmt)
    .by(cmt.id)
    .resultTypeNameAttr(cmtResultType);
}

export function getSelectCmtsAction(opt: {
  // If present, select root cmts.
  // Otherwise, select replies.
  rt: CmtRelationTable | null;
  // Fetches likes if true.
  userMode: boolean;
  // Whether some cmts are excluded. Used when loading more cmts with dynamically added cmts
  // on web side. User mode only.
  filterMode: boolean;
}): mm.SelectAction {
  const jCmt = opt.rt ? opt.rt.cmt_id.associativeJoin(cmt) : cmt;
  const jUser = jCmt.user_id.leftJoin(user);
  const cols: mm.SelectedColumnTypes[] = [
    opt.rt ? opt.rt.cmt_id.as('id').privateAttr() : jCmt.id.privateAttr(),
    ...getCmtCols(jCmt, jUser),
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
    whereSQL = mm.and(whereSQL, mm.sql`${jCmt.id} NOT IN (${jCmt.id.toArrayParam('excluded')})`);
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
