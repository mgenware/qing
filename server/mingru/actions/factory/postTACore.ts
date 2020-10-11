import * as mm from 'mingru-models';
import userTA from '../userTA';
import user, { User } from '../../models/user';
import * as cm from '../../models/common';
import * as cmtf from '../cmtTAFactory';
import PostCmtCore from '../../models/factory/postCmtCore';
import PostCore from '../../models/factory/postCore';

export default abstract class PostTACore extends mm.TableActions {
  // SELECT actions.
  selectPostByID: mm.SelectAction;
  selectPostsForUserProfile: mm.SelectAction;
  selectPostSource: mm.SelectAction;
  selectPostsForDashboard: mm.SelectAction;

  // Other actions.
  deletePosts: mm.DeleteAction;
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
  #batchUpdateConditions: mm.SQL;

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
    this.#updateConditions = mm.and(
      mm.sql`${t.id.isEqualToInput()}`,
      mm.sql`${t.user_id.isEqualToInput()}`,
    );

    this.#batchUpdateConditions = mm.and(
      mm.sql`${t.id.isInArrayInput('ids')}`,
      mm.sql`${t.user_id.isEqualToInput()}`,
    );

    this.selectPostByID = mm.select(...this.#coreColumns, t.content, ...this.#userColumns).byID();
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
    this.deletePosts = mm.deleteSome().whereSQL(this.#batchUpdateConditions);
    this.insertPost = mm
      .transact(
        mm
          .insertOne()
          .setInputs(...this.getPostSourceColumns(), t.user_id)
          .setDefaults()
          .declareInsertedID('postID'),
        userTA.updatePostCount.wrap({ offset: '1' }),
      )
      .argStubs(cm.sanitizedStub, cm.captStub)
      .setReturnValues('postID');
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

  abstract getPostTable(): PostCore;
  abstract getPostCmtTable(): PostCmtCore;
  abstract getCoreColumns(): mm.SelectActionColumns[];
  abstract getPostSourceColumns(): mm.Column[];
  abstract getDashboardOrderInputSelections(): mm.SelectActionColumns[];
}
