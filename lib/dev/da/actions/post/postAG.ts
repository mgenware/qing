/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import post, { Post } from '../../models/post/post.js';
import postCmt from '../../models/post/postCmt.js';
import ContentWithTitleBaseAG from '../com/contentWithTitleBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';

export abstract class PostAGBase<T extends Post> extends ContentWithTitleBaseAG<T> {
  refreshLastRepliedAt = mm
    .updateOne()
    .set(this.baseTable().last_replied_at, mm.datetimeNow())
    .by(this.baseTable().id);

  brDeleteByPrefix = mm
    .deleteSome()
    .whereSQL(mm.sql`${this.baseTable().title} LIKE ${mm.param(this.baseTable().title)}`);

  override contentName(): string {
    return 'Post';
  }

  protected override getIncrementContainerCounterActions(): mm.Action[] {
    return [this.getPostUpdateUserStatAction(1)];
  }

  protected override getDecrementContainerCounterActions(): mm.Action[] {
    return [this.getPostUpdateUserStatAction(-1)];
  }

  private getPostUpdateUserStatAction(offset: number) {
    return userStatsAG.updatePostCount.wrap({ offset, id: mm.captureVar(this.userIDParam) });
  }

  override colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    const t = this.baseTable();
    return [...super.colsOfSelectItemsForPostCenter(), t.cmt_count];
  }

  override colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    const t = this.baseTable();
    return [...super.colsOfSelectItemsForUserProfile(), t.cmt_count];
  }

  override orderByParamsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    const t = this.baseTable();
    return [...super.orderByParamsOfSelectItemsForPostCenter(), t.cmt_count];
  }

  protected override extraInsertItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraInsertItemCols(), t.summary];
  }
  protected override extraUpdateItemCols(): mm.Column[] {
    const t = this.baseTable();
    return [...super.extraUpdateItemCols(), t.summary];
  }
}

export class PostAG extends PostAGBase<Post> {
  override baseTable() {
    return post;
  }

  override baseCmtTable(): ContentBaseCmt {
    return postCmt;
  }
}

export default mm.actionGroup(post, PostAG);
