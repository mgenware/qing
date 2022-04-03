/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import t, { ThreadMsg } from '../../models/thread/threadMsg.js';
import threadMsgCmt from '../../models/thread/threadMsgCmt.js';
import { threadMsgLike } from '../../models/like/likeableTables.js';
import ContentBaseAG from '../com/contentBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';
import threadAG from './threadAG.js';
import { getLikedColFromEntityID } from '../com/likeUtil.js';

const threadMsgResultType = 'ThreadMsgResult';
const threadIDParam = 'threadID';

export class ThreadMsgAG extends ContentBaseAG<ThreadMsg> {
  selectMsgsByThread: mm.Action;
  selectMsgsByThreadWithLikes: mm.Action;
  selectThread: mm.Action;

  constructor() {
    super();

    this.selectMsgsByThread = this.getSelectMsgsByThread(false);
    this.selectMsgsByThreadWithLikes = this.getSelectMsgsByThread(true);
    this.selectThread = mm.selectField(t.thread_id).by(t.id);
  }

  private getSelectMsgsByThread(withLikes: boolean) {
    const cols = this.colsOfSelectItem();
    if (withLikes) {
      cols.push(getLikedColFromEntityID(t.id, threadMsgLike));
    }
    return mm
      .selectRows(...cols)
      .pageMode()
      .by(t.thread_id)
      .orderByAsc(t.likes)
      .resultTypeNameAttr(threadMsgResultType);
  }

  override baseTable() {
    return t;
  }

  override baseCmtTable(): ContentBaseCmt {
    return threadMsgCmt;
  }

  override colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForPostCenter(), t.thread_id];
  }

  override colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForUserProfile(), t.thread_id];
  }

  protected override getIncrementContainerCounterActions(): mm.Action[] {
    return this.getUpdateStatAction(1);
  }

  protected override getDecrementContainerCounterActions(): mm.Action[] {
    return this.getUpdateStatAction(-1);
  }

  private getUpdateStatAction(offset: number) {
    return [
      userStatsAG.updateThreadMsgCount.wrap({ offset, id: mm.captureVar(this.userIDParam) }),
      threadAG.updateMsgCount.wrap({
        offset,
        // When inserting an item, reuse the `threadID` param from containing function.
        // When deleting an item, no `threadID` in containing function, we declare it here.
        id: offset < 0 ? mm.renameArg(threadIDParam) : mm.captureVar(threadIDParam),
      }),
    ];
  }

  override orderByParamsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.orderByParamsOfSelectItemsForPostCenter(), t.cmt_count];
  }

  protected override extraSelectItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraSelectItemCols(), t.thread_id];
  }
  protected override extraInsertItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraInsertItemCols(), t.thread_id];
  }
}

export default mm.actionGroup(t, ThreadMsgAG);
