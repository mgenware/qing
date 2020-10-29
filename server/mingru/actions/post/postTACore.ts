import * as mm from 'mingru-models';
import user, { User } from '../../models/user/user';
import * as cm from '../../models/common';
import * as cmtf from '../cmt/cmtTAFactory';
import PostCmtCore from '../../models/post/postCmtCore';
import PostCore from '../../models/post/postCore';
import { defaultUpdateConditions } from '../common';

const insertedIDVar = 'insertedID';

export default abstract class PostTACore extends mm.TableActions {
  // SELECT actions.
  selectItemByID: mm.SelectAction;
  selectItemsForUserProfile: mm.SelectAction;
  selectItemSource: mm.SelectAction;
  selectItemsForDashboard: mm.SelectAction;

  // Other actions.
  deleteItem: mm.TransactAction;
  insertItem: mm.TransactAction;
  editItem: mm.UpdateAction;

  // Cmt-related actions.
  selectCmts: mm.SelectAction;
  insertCmt: mm.TransactAction;
  deleteCmt: mm.TransactAction;
  insertReply: mm.TransactAction;
  deleteReply: mm.TransactAction;

  // Common columns used by many SELECT actions.
  protected coreColumns: mm.SelectActionColumns[];
  // Joined user table.
  protected joinedUserTable: User;
  // User-related columns;
  protected userColumns: mm.SelectActionColumns[];
  // SQL conditions.
  protected updateConditions: mm.SQL;

  constructor() {
    super();

    const t = this.getItemTable();
    this.joinedUserTable = t.user_id.join(user);
    this.coreColumns = this.getCoreColumns();
    this.userColumns = [
      t.user_id,
      this.joinedUserTable.name,
      this.joinedUserTable.icon_name,
    ].map((c) => c.privateAttr());
    this.updateConditions = defaultUpdateConditions(t);

    this.selectItemByID = mm.select(...this.getFullColumns()).by(t.id);
    this.selectItemsForUserProfile = mm
      .selectPage(...this.coreColumns)
      .by(t.user_id)
      .orderByDesc(t.created_at);
    this.selectItemSource = mm
      .select(...this.getItemSourceColumns())
      .whereSQL(this.updateConditions);
    this.selectItemsForDashboard = mm
      .selectPage(...this.coreColumns)
      .by(t.user_id)
      .orderByInput(...this.getDashboardOrderInputSelections());
    this.deleteItem = mm.transact(
      mm.deleteOne().whereSQL(this.updateConditions),
      this.getContainerUpdateCounterAction().wrap({ offset: '-1' }),
    );
    this.insertItem = mm
      .transact(
        mm
          .insertOne()
          .setInputs(
            ...this.getItemSourceColumns(),
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
      .setInputs(...this.getItemSourceColumns())
      .argStubs(cm.sanitizedStub)
      .whereSQL(this.updateConditions);

    this.selectCmts = cmtf.selectCmts(this.getItemCmtTable());
    this.insertCmt = cmtf.insertCmtAction(t, this.getItemCmtTable());
    this.deleteCmt = cmtf.deleteCmtAction(t);
    this.insertReply = cmtf.insertReplyAction(t);
    this.deleteReply = cmtf.deleteReplyAction(t);
  }

  // Gets the underlying `PostCore` table.
  abstract getItemTable(): PostCore;

  // Gets the underlying `PostCmtCore` table.
  abstract getItemCmtTable(): PostCmtCore;

  // Gets core columns, which will be fetched in every SELECT action.
  abstract getCoreColumns(): mm.SelectActionColumns[];

  // Gets columns that are fetched during editing.
  // NOTE1: those columns are also considered inputs during insertion.
  // NOTE2: no need to include `user_id` column.
  abstract getItemSourceColumns(): mm.Column[];

  // Gets columns used to generate ORDER BY input enum in dashboard.
  abstract getDashboardOrderInputSelections(): mm.SelectActionColumns[];

  // Gets extra columns that are considered inputs during insertion.
  getExtraInsertionInputColumns(): mm.Column[] {
    return [];
  }

  // Gets the update action of container table to update the counter in response
  // to a insertion or deletion.
  abstract getContainerUpdateCounterAction(): mm.Action;

  protected getFullColumns(): mm.SelectActionColumns[] {
    const t = this.getItemTable();
    return [...this.coreColumns, t.content, ...this.userColumns];
  }
}
