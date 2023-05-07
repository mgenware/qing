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
import userStatsAG from '../user/userStatsAG.js';
import { PostAGBase } from '../post/postAG.js';

export class FPostAG extends PostAGBase<FPost> {
  override baseTable() {
    return t;
  }

  override baseCmtTable(): ContentBaseCmt {
    return fpostCmt;
  }

  protected override getIncrementContainerCounterActions(): mm.Action[] {
    return [this.getFpostUpdateUserStatAction(1)];
  }

  protected override getDecrementContainerCounterActions(): mm.Action[] {
    return [this.getFpostUpdateUserStatAction(-1)];
  }

  private getFpostUpdateUserStatAction(offset: number) {
    return userStatsAG.updateFPostCount.wrap({ offset, id: mm.captureVar(this.userIDParam) });
  }

  override colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForPostCenter(), t.forum_id];
  }

  override colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForUserProfile(), t.forum_id];
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
