import * as mm from 'mingru-models';
import user, { User } from '../../models/user/user';
import * as cm from '../../models/common';
import * as cmtf from '../cmt/cmtTAFactory';
import PostCmtCore from '../../models/post/postCmtCore';
import PostCore from '../../models/post/postCore';
import { defaultUpdateConditions } from '../common';
import { offsetParamName } from '../user/userStatsTA';

const insertedIDVar = 'insertedID';

export default abstract class PostTACore extends mm.TableActions {
  // SELECT actions.
  selectPostByID: mm.SelectAction;
  selectPostsForUserProfile: mm.SelectAction;
  selectPostSource: mm.SelectAction;
  selectPostsForDashboard: mm.SelectAction;

  // Other actions.
  deletePost: mm.TransactAction;
  insertPost: mm.TransactAction;
  editPost: mm.UpdateAction;

  // Cmt-related actions.
  selectCmts: mm.SelectAction;
  insertCmt: mm.TransactAction;
  deleteCmt: mm.TransactAction;
  insertReply: mm.TransactAction;
  deleteReply: mm.TransactAction;

  // Common columns used by many SELECT actions.
  #coreColumns: mm.SelectActionColumns[];
  // Joined user table.
  #joinedUserTable: User;
  // User-related columns;
  #userColumns: mm.SelectActionColumns[];
  // SQL conditions.
  #updateConditions: mm.SQL;

  // Shorthand for `this.getPostTable`.
  private get t(): PostCore {
    return this.getPostTable();
  }

  constructor() {
    super();

    const { t } = this;
    this.#joinedUserTable = t.user_id.join(user);
    this.#coreColumns = this.getCoreColumns();
    this.#userColumns = [
      t.user_id,
      this.#joinedUserTable.name,
      this.#joinedUserTable.icon_name,
    ].map((c) => c.privateAttr());
    this.#updateConditions = defaultUpdateConditions(t);

    this.selectPostByID = mm.select(...this.#coreColumns, t.content, ...this.#userColumns).by(t.id);
    this.selectPostsForUserProfile = mm
      .selectPage(...this.#coreColumns)
      .by(t.user_id)
      .orderByDesc(t.created_at);
    this.selectPostSource = mm
      .select(...this.getPostSourceColumns())
      .whereSQL(this.#updateConditions);
    this.selectPostsForDashboard = mm
      .selectPage(...this.#coreColumns)
      .by(t.user_id)
      .orderByInput(...this.getDashboardOrderInputSelections());
    this.deletePost = mm.transact(
      mm.deleteOne().whereSQL(this.#updateConditions),
      this.getContainerUpdateCounterAction().wrap({ [offsetParamName]: '-1' }),
    );
    this.insertPost = mm
      .transact(
        mm
          .insertOne()
          .setInputs(
            ...this.getPostSourceColumns(),
            t.user_id,
            ...this.getExtraInsertionInputColumns(),
          )
          .setDefaults()
          .declareInsertedID(insertedIDVar),
        this.getContainerUpdateCounterAction().wrap({ [offsetParamName]: '1' }),
      )
      .argStubs(cm.sanitizedStub, cm.captStub)
      .setReturnValues(insertedIDVar);
    this.editPost = mm
      .updateOne()
      .setDefaults(t.modified_at)
      .setInputs(...this.getPostSourceColumns())
      .argStubs(cm.sanitizedStub)
      .whereSQL(this.#updateConditions);

    this.selectCmts = cmtf.selectCmts(this.getPostCmtTable());
    this.insertCmt = cmtf.insertCmtAction(t, this.getPostCmtTable());
    this.deleteCmt = cmtf.deleteCmtAction(t);
    this.insertReply = cmtf.insertReplyAction(t);
    this.deleteReply = cmtf.deleteReplyAction(t);
  }

  // Gets the underlying `PostCore` table.
  abstract getPostTable(): PostCore;

  // Gets the underlying `PostCmtCore` table.
  abstract getPostCmtTable(): PostCmtCore;

  // Gets core columns, which will be fetched in every SELECT action.
  abstract getCoreColumns(): mm.SelectActionColumns[];

  // Gets columns that are fetched during editing.
  // NOTE1: those columns are also considered inputs during insertion.
  // NOTE2: no need to include `user_id` column.
  abstract getPostSourceColumns(): mm.Column[];

  // Gets columns used to generate ORDER BY input enum in dashboard.
  abstract getDashboardOrderInputSelections(): mm.SelectActionColumns[];

  // Gets extra columns that are considered inputs during insertion.
  getExtraInsertionInputColumns(): mm.Column[] {
    return [];
  }

  // Gets the update action of container table to update the counter in response to a insertion or deletion.
  abstract getContainerUpdateCounterAction(): mm.Action;
}
