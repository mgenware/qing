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
import ContentBaseAG from '../com/contentBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';

export class ThreadMsgAG extends ContentBaseAG<ThreadMsg> {
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
