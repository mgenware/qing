/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import user, { User } from '../../models/user/user';
import * as cm from '../../models/common';
import * as cmtf from '../cmt/cmtTAFactory';
import { defaultUpdateConditions } from '../common';
import ContentBase from '../../models/com/contentBase';
import ContentCmtBase from '../../models/com/contentCmtCore';
import { getEntitySrcType } from '../defs';

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

  // Cmt-related actions.
  selectCmts: mm.SelectAction;
  insertCmt: mm.TransactAction;
  deleteCmt: mm.TransactAction;
  insertReply: mm.TransactAction;
  deleteReply: mm.TransactAction;

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
    this.userColumns = [
      t.user_id,
      this.joinedUserTable.name,
      this.joinedUserTable.icon_name,
    ].map((c) => c.privateAttr());
    this.dateColumns = [t.created_at, t.modified_at];

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
      .resultTypeNameAttr(getEntitySrcType);

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
        this.getContainerUpdateCounterAction().wrap({ offset: '-1' }),
      );
    this.insertItem = mm
      .transact(
        mm
          .insertOne()
          .setInputs(
            ...this.getStartingInsertionInputColumns(),
            ...this.getEditingColumns(),
            t.user_id,
            ...this.getExtraInsertionInputColumns(),
          )
          .setDefaults()
          .declareInsertedID(insertedIDVar),
        this.getContainerUpdateCounterAction().wrap({ offset: '1' }),
      )
      .argStubs(cm.sanitizedStub, cm.captStub)
      .setReturnValues(insertedIDVar);
    this.editItem = mm
      .updateOne()
      .setDefaults(t.modified_at)
      .setInputs(...this.getEditingColumns())
      .argStubs(cm.sanitizedStub)
      .whereSQL(this.updateConditions);

    this.selectCmts = cmtf.selectCmts(this.getCmtBaseTable());
    this.insertCmt = cmtf.insertCmtAction(t, this.getCmtBaseTable());
    this.deleteCmt = cmtf.deleteCmtAction(t, this.getCmtBaseTable());
    this.insertReply = cmtf.insertReplyAction(t);
    this.deleteReply = cmtf.deleteReplyAction(t, this.getCmtBaseTable());
  }

  // Gets the underlying `ContentBase` table.
  abstract getBaseTable(): ContentBase;

  // Gets the underlying `ContentCmtBase` table.
  abstract getCmtBaseTable(): ContentCmtBase;

  // Returns [] if post center is not supported.
  abstract getPCColumns(): mm.SelectedColumn[];
  abstract getPCOrderByColumns(): mm.SelectedColumn[];
  // Returns [] if profile is not supported.
  abstract getProfileColumns(): mm.SelectedColumn[];
  abstract getEditingColumns(): mm.Column[];
  abstract getExtraFullColumns(): mm.SelectedColumn[];

  // Gets extra columns that are considered inputs during insertion.
  getExtraInsertionInputColumns(): mm.Column[] {
    return [];
  }

  // Gets the update action of container table to update the counter in response
  // to a insertion or deletion.
  abstract getContainerUpdateCounterAction(): mm.Action;

  protected deleteItemOverride(): mm.Action | null {
    return null;
  }

  protected getFullColumns(): mm.SelectedColumn[] {
    const t = this.getBaseTable();
    const idCol = t.id.privateAttr();
    return [
      idCol,
      ...this.userColumns,
      ...this.dateColumns,
      t.content,
      ...this.getExtraFullColumns(),
    ];
  }

  // Used by threads as `forum_id` should be the first param during insertion.
  protected getStartingInsertionInputColumns(): mm.Column[] {
    return [];
  }
}
