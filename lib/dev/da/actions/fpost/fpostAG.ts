/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import t, { FPost } from '../../models/fpost/fpost.js';
import fpostCmt from '../../models/fpost/fpostCmt.js';
import ContentWithTitleBaseAG from '../com/contentWithTitleBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';

export class FPostAG extends ContentWithTitleBaseAG<FPost> {
  refreshLastRepliedAt = mm.updateOne().set(t.last_replied_at, mm.datetimeNow()).by(t.id);

  override baseTable() {
    return t;
  }

  override baseCmtTable(): ContentBaseCmt {
    return fpostCmt;
  }

  protected override getIncrementContainerCounterActions(): mm.Action[] {
    return [this.getUpdateUserStatAction(1)];
  }

  protected override getDecrementContainerCounterActions(): mm.Action[] {
    return [this.getUpdateUserStatAction(-1)];
  }

  private getUpdateUserStatAction(offset: number) {
    return userStatsAG.updateFPostCount.wrap({ offset, id: mm.captureVar(this.userIDParam) });
  }

  override colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForPostCenter(), t.cmt_count, t.forum_id];
  }

  override colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForUserProfile(), t.cmt_count, t.forum_id];
  }

  override orderByParamsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.orderByParamsOfSelectItemsForPostCenter(), t.cmt_count];
  }

  protected override extraSelectItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraSelectItemCols(), t.forum_id];
  }

  protected override extraInsertItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraInsertItemCols(), t.forum_id];
  }
}

export default mm.actionGroup(t, FPostAG);
