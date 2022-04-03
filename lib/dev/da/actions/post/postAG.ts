/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import t, { Post } from '../../models/post/post.js';
import postCmt from '../../models/post/postCmt.js';
import ContentWithTitleBaseAG from '../com/contentWithTitleBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';

export class PostAG extends ContentWithTitleBaseAG<Post> {
  override baseTable() {
    return t;
  }

  override baseCmtTable(): ContentBaseCmt {
    return postCmt;
  }

  protected override getIncrementContainerCounterActions(): mm.Action[] {
    return [this.getUpdateUserStatAction(1)];
  }

  protected override getDecrementContainerCounterActions(): mm.Action[] {
    return [this.getUpdateUserStatAction(-1)];
  }

  private getUpdateUserStatAction(offset: number) {
    return userStatsAG.updatePostCount.wrap({ offset, id: mm.captureVar(this.userIDParam) });
  }

  override colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForPostCenter(), t.cmt_count];
  }

  override colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    return [...super.colsOfSelectItemsForUserProfile(), t.cmt_count];
  }

  override orderByParamsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [...super.orderByParamsOfSelectItemsForPostCenter(), t.cmt_count];
  }
}

export default mm.actionGroup(t, PostAG);
