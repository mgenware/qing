/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import t from '../../models/thread/threadMsg.js';
import threadMsgCmt from '../../models/thread/threadMsgCmt.js';
import ContentWithTitleBaseAG from '../com/contentWithTitleBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';

export class ThreadMsgAG extends ContentWithTitleBaseAG {
  override baseTable(): ContentBase {
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

  override extendedCoreCols(): mm.Column[] {
    return [t.thread_id];
  }

  override colsOfSelectItem(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItem(), t.thread_id];
  }

  override getContainerUpdateCounterActions(): mm.Action[] {
    return [userStatsAG.updateThreadMsgCount];
  }
}

export default mm.actionGroup(t, ThreadMsgAG);
