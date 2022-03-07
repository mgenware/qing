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

export default abstract class ContentBaseTA extends mm.TableActions {
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

  constructor() {
    super();

    const t = this.getBaseTable();
    const idCol = t.id.privateAttr();
    this.joinedUserTable = t.user_id.join(user);
    this.userColumns = [t.user_id, this.joinedUserTable.name, this.joinedUserTable.icon_name].map(
      (c) => c.privateAttr(),
    );
    this.dateColumns = [t.created_at.privateAttr(), t.modified_at.privateAttr()];

    const { dateColumns } = this;

    this.updateConditions = defaultUpdateConditions(t);
    this.selectItemByID = mm.selectRow(...this.getFullColumns()).by(t.id);

    const profileCols = this.getProfileColumns();
    this.selectItemsForUserProfile = profileCols.length
      ? mm
          .selectRows(idCol, ...dateColumns, ...profileCols)
          .pageMode()
          .by(t.user_id)
          .orderByDesc(t.created_at)
      : mm.emptyAction;
    this.selectItemSrc = mm
      .selectRow(...this.getEditingColumns())
      .whereSQL(this.updateConditions)
      .resultTypeNameAttr(getEntitySrcType)
      .attr(mm.ActionAttribute.enableTSResultType, true);

    const pcCols = this.getPCColumns();
    this.selectItemsForPostCenter = pcCols.length
      ? mm
          .selectRows(idCol, ...dateColumns, ...pcCols)
          .pageMode()
          .by(t.user_id)
          .orderByInput(...this.getPCOrderByColumns())
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
          .setInputs(
            ...this.getStartingInsertionInputColumns(),
            ...this.getEditingColumns(),
            t.user_id,
            t.created_at,
            t.modified_at,
            ...this.getExtraInsertionInputColumns(),
          )
          .setDefaults()
          .declareInsertedID(insertedIDVar),
        ...this.getIncrementContainerCounterActions(),
      )
      .argStubs(cm.sanitizedStub, cm.captStub)
      .setReturnValues(insertedIDVar);
    this.editItem = mm
      .updateOne()
      .setInputs(...this.getEditingColumns(), t.modified_at)
      .argStubs(cm.sanitizedStub)
      .whereSQL(this.updateConditions);

    this.testUpdateDates = mm.updateOne().setInputs(t.created_at, t.modified_at).by(t.id);
  }

  // Gets the underlying `ContentBase` table.
  abstract getBaseTable(): ContentBase;

  // Gets the underlying `ContentCmtBase` table.
  abstract getCmtBaseTable(): ContentBaseCmt;

  // Returns [] if post center is not supported.
  abstract getPCColumns(): mm.SelectedColumnTypes[];
  abstract getPCOrderByColumns(): mm.SelectedColumnTypes[];
  // Returns [] if profile is not supported.
  abstract getProfileColumns(): mm.SelectedColumnTypes[];
  abstract getEditingColumns(): mm.Column[];

  // Gets extra columns that are considered inputs during insertion.
  getExtraInsertionInputColumns(): mm.Column[] {
    return [];
  }

  // Gets a list of update actions of container table to update the counters in response
  // to a insertion or deletion.
  // For top entities like posts, it returns a single action to update `user_post_count`.
  // For sub-entities like answers, it returns 2 actions, one for updating `user_answer_count`.
  // the other is for updating `parent_question.reply_count`.
  // NOTE: Comments have their own TA due to recursive structure.
  abstract getContainerUpdateCounterActions(): mm.Action[];

  private callContainerUpdateCounterActions(offset: number) {
    return this.getContainerUpdateCounterActions().map((a) => a.wrap({ offset }));
  }

  protected getIncrementContainerCounterActions() {
    return this.callContainerUpdateCounterActions(1);
  }

  protected getDecrementContainerCounterActions() {
    return this.callContainerUpdateCounterActions(-1);
  }

  protected deleteItemOverride(): mm.Action | null {
    return null;
  }

  protected getFullColumns(): mm.SelectedColumnTypes[] {
    const t = this.getBaseTable();
    const idCol = t.id.privateAttr();
    return [idCol, ...this.userColumns, ...this.dateColumns, t.content];
  }

  // Used by threads as `forum_id` should be the first param during insertion.
  protected getStartingInsertionInputColumns(): mm.Column[] {
    return [];
  }
}
