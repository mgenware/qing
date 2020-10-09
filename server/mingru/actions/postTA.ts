import * as mm from 'mingru-models';
import t from '../models/post';
import userTA from './userTA';
import user from '../models/user';
import postCmt from '../models/postCmt';
import * as cm from '../models/common';
import * as cmtf from './cmtTAFactory';

const coreCols = [t.id.privateAttr(), t.title, t.created_at, t.modified_at, t.cmt_count, t.likes];
const jUser = t.user_id.join(user);
const userCols = [t.user_id, jUser.name, jUser.icon_name].map((c) => c.privateAttr());

const updateConditions = mm.and(
  mm.sql`${t.id.isEqualToInput()}`,
  mm.sql`${t.user_id.isEqualToInput()}`,
);

const batchUpdateConditions = mm.and(
  mm.sql`${t.id.isInArrayInput('ids')}`,
  mm.sql`${t.user_id.isEqualToInput()}`,
);

export class PostTA extends mm.TableActions {
  selectPostByID = mm.select(...coreCols, t.content, ...userCols).byID();
  selectPostsForUserProfile = mm
    .selectPage(...coreCols)
    .by(t.user_id)
    .orderByInput(t.created_at, t.modified_at, t.likes, t.cmt_count);

  selectPostSource = mm.select(t.title, t.content).whereSQL(updateConditions);

  selectPostsForDashboard = mm
    .selectPage(...coreCols)
    .by(t.user_id)
    .orderByDesc(t.created_at);
  deletePosts = mm.deleteSome().whereSQL(batchUpdateConditions);

  selectCmts = cmtf.selectCmts(postCmt);
  insertCmt = cmtf.insertCmtAction(t, postCmt);
  deleteCmt = cmtf.deleteCmtAction(t);
  insertReply = cmtf.insertReplyAction(t);
  deleteReply = cmtf.deleteReplyAction(t);

  insertPost = mm
    .transact(
      mm
        .insertOne()
        .setInputs(t.title, t.content, t.user_id)
        .setDefaults()
        .declareInsertedID('postID'),
      userTA.updatePostCount.wrap({ offset: '1' }),
    )
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues('postID');

  editPost = mm
    .updateOne()
    .setDefaults(t.modified_at)
    .setInputs(t.title, t.content)
    .argStubs(cm.sanitizedStub)
    .whereSQL(updateConditions);
}

export default mm.tableActions(t, PostTA);
