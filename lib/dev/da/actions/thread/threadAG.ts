/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import t, { Thread } from '../../models/thread/thread.js';
import threadCmt from '../../models/thread/threadCmt.js';
import ContentWithTitleBaseAG from '../com/contentWithTitleBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';

export class ThreadAG extends ContentWithTitleBaseAG<Thread> {
  override baseTable() {
    return t;
  }

  override baseCmtTable(): ContentBaseCmt {
    return threadCmt;
  }

  override colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForPostCenter(), t.msg_count];
  }

  override colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForUserProfile(), t.msg_count];
  }

  override extendedCoreCols(): mm.Column[] {
    return [...super.extendedCoreCols(), t.msg_count, t.forum_id];
  }

  override getContainerUpdateCounterActions(): mm.Action[] {
    return [userStatsAG.updateThreadCount];
  }
}

export default mm.actionGroup(t, ThreadAG);
