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
import * as uca from '../com/updateCounterAction.js';

export class ThreadAG extends ContentWithTitleBaseAG<Thread> {
  updateMsgCount = uca.updateCounterAction(t, t.msg_count);

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

  protected override getIncrementContainerCounterActions(): mm.Action[] {
    return [this.getUpdateUserStatAction(1)];
  }

  protected override getDecrementContainerCounterActions(): mm.Action[] {
    return [this.getUpdateUserStatAction(-1)];
  }

  private getUpdateUserStatAction(offset: number) {
    return userStatsAG.updateThreadCount.wrap({ offset, id: mm.captureVar(this.userIDParam) });
  }

  override orderByParamsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.orderByParamsOfSelectItemsForPostCenter(), t.msg_count];
  }

  protected override extraSelectItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraSelectItemCols(), t.msg_count, t.forum_id];
  }
  protected override extraInsertItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraInsertItemCols(), t.forum_id];
  }
}

export default mm.actionGroup(t, ThreadAG);
