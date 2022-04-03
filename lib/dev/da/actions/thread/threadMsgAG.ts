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
import { getLikedColFromEntityID } from '../com/likeUtil.js';

const threadMsgResultType = 'ThreadMsgResult';

export class ThreadMsgAG extends ContentBaseAG<ThreadMsg> {
  selectMsgsByThread: mm.Action;
  selectMsgsByThreadWithLikes: mm.Action;

  constructor() {
    super();

    this.selectMsgsByThread = this.getSelectMsgsByThread(false);
    this.selectMsgsByThreadWithLikes = this.getSelectMsgsByThread(true);
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

  override extendedCoreCols(): mm.Column[] {
    return [...super.extendedCoreCols(), t.thread_id];
  }

  override colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForPostCenter(), t.thread_id];
  }

  override colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForUserProfile(), t.thread_id];
  }

  override getContainerUpdateCounterActions(): mm.Action[] {
    return [userStatsAG.updateThreadMsgCount];
  }
}

export default mm.actionGroup(t, ThreadMsgAG);
