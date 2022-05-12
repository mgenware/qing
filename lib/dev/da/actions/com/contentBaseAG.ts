/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import user, { User } from '../../models/user/user.js';
import * as cm from '../../models/common.js';
import { defaultUpdateConditions } from '../common.js';
import ContentBase from '../../models/com/contentBase.js';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import { getEntitySrcType } from '../defs.js';

const insertedIDVar = 'insertedID';

export default abstract class ContentBaseAG<T extends ContentBase> extends mm.ActionGroup {
  // SELECT actions.
  selectItemByID: mm.Action;
  selectItemSrc: mm.SelectAction;
  // Optional actions.
  selectItemsForUserProfile: mm.Action;
  selectItemsForPostCenter: mm.Action;

  // Other actions.
  deleteItem: mm.Action;
  insertItem: mm.Action;
  editItem: mm.UpdateAction;

  testUpdateDates: mm.UpdateAction;

  // Joined user table.
  protected joinedUserTable: User;
  // User-related columns;
  protected userColumns: mm.SelectedColumn[];
  // Date-related columns;
  protected dateColumns: mm.SelectedColumn[];
  // SQL conditions.
  protected updateConditions: mm.SQL;

  protected get userIDParam() {
    return 'userID';
  }

  constructor() {
    super();

    const t = this.baseTable();
    const idCol = t.id.privateAttr();
    this.joinedUserTable = t.user_id.join(user);
    this.userColumns = [t.user_id, this.joinedUserTable.name, this.joinedUserTable.icon_name].map(
      (c) => c.privateAttr(),
    );
    this.dateColumns = [t.created_at.privateAttr(), t.modified_at.privateAttr()];

    const { dateColumns } = this;

    this.updateConditions = defaultUpdateConditions(t);
    this.selectItemByID = mm.selectRow(...this.colsOfSelectItem()).by(t.id);

    const profileCols = this.colsOfSelectItemsForUserProfile();
    this.selectItemsForUserProfile = profileCols.length
      ? mm
          .selectRows(idCol, ...dateColumns, ...profileCols)
          .pageMode()
          .by(t.user_id)
          .orderByDesc(t.created_at)
      : mm.emptyAction;
    this.selectItemSrc = mm
      .selectRow(t.content, ...this.extraSelectSrcItemCols())
      .whereSQL(this.updateConditions)
      .resultTypeNameAttr(getEntitySrcType)
      .attr(mm.ActionAttribute.enableTSResultType, true);

    const pcCols = this.colsOfSelectItemsForPostCenter();
    this.selectItemsForPostCenter = pcCols.length
      ? mm
          .selectRows(idCol, ...this.dateColumns, t.likes, ...pcCols)
          .pageMode()
          .by(t.user_id)
          .orderByParams(...this.orderByParamsOfSelectItemsForPostCenter())
      : mm.emptyAction;

    this.deleteItem =
      this.deleteItemOverride() ??
      mm.transact(
        mm.deleteOne().whereSQL(this.updateConditions),
        ...this.getDecrementContainerCounterActions(),
      );
    this.insertItem = mm
      .transact(
        mm
          .insertOne()
          .setParams(...this.colsOfInsertItem())
          .setDefaults()
          .declareInsertedID(insertedIDVar),
        ...this.getIncrementContainerCounterActions(),
      )
      .argStubs(cm.sanitizedStub, cm.captStub)
      .setReturnValues(insertedIDVar);
    this.editItem = mm
      .updateOne()
      .setParams(t.modified_at, t.content, ...this.extraUpdateItemCols())
      .argStubs(cm.sanitizedStub)
      .whereSQL(this.updateConditions);

    this.testUpdateDates = mm.updateOne().setParams(t.created_at, t.modified_at).by(t.id);
  }

  // Gets the underlying `ContentBase` table.
  abstract baseTable(): T;
  abstract baseCmtTable(): ContentBaseCmt;

  // Returns [] if post center is not supported.
  protected colsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    return [];
  }
  protected orderByParamsOfSelectItemsForPostCenter(): mm.SelectedColumnTypes[] {
    const t = this.baseTable();
    return [t.created_at, t.likes];
  }
  // Returns [] if profile is not supported.
  protected colsOfSelectItemsForUserProfile(): mm.SelectedColumnTypes[] {
    return [];
  }

  protected extraSelectItemCols(): mm.Column[] {
    return [];
  }
  protected extraSelectSrcItemCols(): mm.Column[] {
    return [];
  }
  protected extraInsertItemCols(): mm.Column[] {
    return [];
  }
  protected extraUpdateItemCols(): mm.Column[] {
    return [];
  }

  protected colsOfInsertItem() {
    const t = this.baseTable();
    return [t.user_id, t.created_at, t.modified_at, t.content, ...this.extraInsertItemCols()];
  }

  // Gets a list of update actions of container table to update the counters in response
  // to a insertion or deletion.
  // For top entities like posts, it returns a single action to update `user_post_count`.
  // For sub-entities like answers, it returns 2 actions, one for updating `user_answer_count`.
  // the other is for updating `parent_thread.reply_count`.
  // NOTE: Comments have their own TA due to recursive structure.
  protected abstract getIncrementContainerCounterActions(): mm.Action[];
  protected abstract getDecrementContainerCounterActions(): mm.Action[];

  protected deleteItemOverride(): mm.Action | null {
    return null;
  }

  protected colsOfSelectItem(): mm.SelectedColumnTypes[] {
    const t = this.baseTable();
    const idCol = t.id.privateAttr();
    return [
      idCol,
      ...this.userColumns,
      ...this.dateColumns,
      t.content,
      t.likes,
      t.cmt_count,
      ...this.extraSelectItemCols(),
    ];
  }
}
