/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import cmt from '../../models/cmt/cmt.js';
import user from '../../models/user/user.js';
import * as cm from '../../models/common.js';
import cmtTA from './cmtTA.js';
import {
  CmtRelationTable,
  cmtInterface,
  cmtResultType,
  CmtHostTable,
  hasLikedProp,
  viewerUserIDInput,
} from './cmtTAUtils.js';
import { updateCounterAction } from '../misc/counterColumnTAFactory.js';
import { defaultUpdateConditions } from '../common.js';
import { cmtLike } from '../../models/like/likeableTables.js';

const hostID = 'hostID';
const cmtID = 'cmtID';
const parentID = 'parentID';
const replyID = 'replyID';
const replyCount = 'replyCount';
const hostIDAndReplyCount = 'hostIDAndReplyCount';
const cmtIDAndHostID = 'cmtIDAndHostID';

export function selectCmts(rt: CmtRelationTable, withLike: boolean): mm.SelectAction {
  const jCmt = rt.cmt_id.associativeJoin(cmt);
  const cols: mm.SelectedColumnTypes[] = [
    rt.cmt_id.as('id').privateAttr(),
    jCmt.content,
    jCmt.created_at.privateAttr(),
    jCmt.modified_at.privateAttr(),
    jCmt.reply_count,
    jCmt.likes,
    jCmt.user_id.privateAttr(),
    jCmt.user_id.join(user).name,
    jCmt.user_id.join(user).icon_name.privateAttr(),
  ];
  if (withLike) {
    const likeUserID = rt.cmt_id.leftJoin(
      cmtLike,
      cmtLike.host_id,
      undefined,
      (jt) => mm.sql`AND ${jt.user_id.isEqualToInput(viewerUserIDInput)}`,
    ).user_id;
    cols.push(likeUserID.as(hasLikedProp));
  }
  return mm
    .selectRows(...cols)
    .from(rt)
    .pageMode()
    .by(rt.host_id)
    .orderByDesc(jCmt.created_at)
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface)
    .resultTypeNameAttr(cmtResultType)
    .attr(mm.ActionAttribute.tsTypeName, cmtResultType);
}

export function updateCmtCountAction(pt: CmtHostTable, offsetSQL: number | mm.SQL): mm.Action {
  return updateCounterAction(pt, pt.cmt_count, { rawOffsetSQL: offsetSQL, idInputName: hostID });
}

export function insertCmtAction(ht: CmtHostTable, rt: CmtRelationTable): mm.TransactAction {
  return mm
    .transact(
      // Insert the cmt.
      mm.insertOne().from(cmt).setDefaults().setInputs().declareInsertedID(cmtID),
      // Set up relationship with host.
      mm.insertOne().from(rt).setInputs().wrapAsRefs({ cmtID }),
      // cmt count ++.
      updateCmtCountAction(ht, 1),
    )
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(cmtID);
}

export function insertReplyAction(ht: CmtHostTable): mm.TransactAction {
  return mm
    .transact(
      // Insert the reply.
      cmtTA.insertCore.declareInsertedID(replyID),
      // cmt.replyCount++.
      cmtTA.updateReplyCount.wrap({
        offset: '1',
        id: mm.valueRef(parentID),
      }),
      // host.cmtCount++.
      updateCmtCountAction(ht, 1),
    )
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface)
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues(replyID);
}

export function deleteCmtAction(ht: CmtHostTable, rt: CmtRelationTable): mm.TransactAction {
  const cmtTableJoin = rt.cmt_id.join(cmt);
  const hostIDProp = 'HostID';
  const replyCountProp = 'ReplyCount';
  return mm
    .transact(
      // Fetch host ID and reply count.
      mm
        .selectRow(rt.host_id, mm.sel(cmtTableJoin.reply_count, replyCountProp))
        .by(rt.cmt_id, 'id')
        .from(rt)
        .declareReturnValue(mm.ReturnValues.result, hostIDAndReplyCount),
      // Delete the cmt.
      mm.deleteOne().from(cmt).whereSQL(defaultUpdateConditions(cmt)),
      // host.cmtCount = host.cmtCount - replyCount - 1 (the comment itself)
      // The inputs of `updateCmtCountAction` are from the results of the first mem of this TX.
      updateCmtCountAction(ht, mm.sql`- ${mm.uInt().toInput(replyCount)} - 1`).wrap({
        replyCount: mm.valueRef(`${hostIDAndReplyCount}.${replyCountProp}`),
        hostID: mm.valueRef(`${hostIDAndReplyCount}.${hostIDProp}`),
      }),
    )
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface);
}

export function deleteReplyAction(ht: CmtHostTable, rt: CmtRelationTable): mm.TransactAction {
  const parentHostIDProp = 'ParentHostID';
  const parentIDProp = 'ParentID';
  return mm
    .transact(
      // Get cmt ID and host ID.
      mm
        .selectRow(
          cmt.parent_id,
          mm.sel(cmt.parent_id.join(cmt).id.join(rt).host_id, parentHostIDProp),
        )
        .from(cmt)
        .by(cmt.id)
        .declareReturnValue(mm.ReturnValues.result, cmtIDAndHostID),
      // Delete the reply.
      cmtTA.deleteReplyCore,
      // cmt.replyCount--.
      updateCmtCountAction(ht, -1).wrap({
        hostID: mm.valueRef(`${cmtIDAndHostID}.${parentHostIDProp}`),
      }),
      // host.cmtCount--.
      cmtTA.updateReplyCount.wrap({
        offset: '-1',
        id: mm.valueRef(`${cmtIDAndHostID}.${parentIDProp}`),
      }),
    )
    .attr(mm.ActionAttribute.groupTypeName, cmtInterface);
}
