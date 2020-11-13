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
  selectItemForEditing: mm.SelectAction;
  selectItemsForDashboard: mm.SelectAction;

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
  protected userColumns: mm.SelectActionColumns[];
  // Date-related columns;
  protected dateColumns: mm.SelectActionColumns[];
  // SQL conditions.
  protected updateConditions: mm.SQL;

  constructor() {
    super();

    const t = this.getItemTable();
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
    this.selectItemByID = mm.select(...this.getFullColumns()).by(t.id);
    this.selectItemsForUserProfile = mm
      .selectPage(idCol, ...dateColumns, ...this.getProfileColumns())
      .by(t.user_id)
      .orderByDesc(t.created_at);
    this.selectItemForEditing = mm
      .select(idCol, ...this.getEditingColumns())
      .whereSQL(this.updateConditions);
    this.selectItemsForDashboard = mm
      .selectPage(idCol, ...dateColumns, ...this.getDashboardColumns())
      .by(t.user_id)
      .orderByInput(...this.getDashboardOrderByColumns());
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

  abstract getDashboardColumns(): mm.SelectActionColumns[];
  abstract getDashboardOrderByColumns(): mm.SelectActionColumns[];
  abstract getProfileColumns(): mm.SelectActionColumns[];
  abstract getEditingColumns(): mm.Column[];
  abstract getExtraFullColumns(): mm.SelectActionColumns[];

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

  protected getFullColumns(): mm.SelectActionColumns[] {
    const t = this.getItemTable();
    const idCol = t.id.privateAttr();
    return [
      idCol,
      ...this.userColumns,
      ...this.dateColumns,
      t.content,
      ...this.getExtraFullColumns(),
    ];
  }
}
