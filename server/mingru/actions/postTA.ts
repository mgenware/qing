import * as mm from 'mingru-models';
import t from '../models/post';
import userTA from './userTA';
import user from '../models/user';
import postCmt from '../models/postCmt';
import * as cm from '../models/common';
import * as cmtf from './cmtTAFactory';

const coreCols = [t.id, t.title, t.created_at, t.modified_at, t.cmt_count];
const jUser = t.user_id.join(user);
const userCols = [t.user_id, jUser.name, jUser.icon_name].map(c =>
  c.privateAttr(),
);

const updateConditions = mm.and(
  mm.sql`${t.id.isEqualToInput()}`,
  mm.sql`${t.user_id.isEqualToInput()}`,
);

export class PostTA extends mm.TableActions {
  selectPostsByUser = mm
    .selectPage(...coreCols)
    .by(t.user_id)
    .orderByDesc(t.created_at);

  selectPostSource = mm.select(t.title, t.content).where(updateConditions);

  selectCmts = cmtf.selectCmts(postCmt);
  insertCmt = cmtf.insertCmtAction(t, postCmt);
  deleteCmt = cmtf.deleteCmtAction(t);
  insertReply = cmtf.insertReplyAction(t);

  insertPost = mm
    .transact(
      mm
        .insertOne()
        .setInputs(t.title, t.content, t.user_id)
        .setDefaults()
        .declareInsertedID('postID'),
      userTA.updatePostCount.wrap({ offset: 1 }),
    )
    .argStubs(cm.sanitizedStub, cm.captStub)
    .setReturnValues('postID');

  editPost = mm
    .updateOne()
    .setDefaults(t.modified_at)
    .setInputs(t.title, t.content)
    .argStubs(cm.sanitizedStub)
    .where(updateConditions);

  deletePost = mm.deleteOne().where(updateConditions);

  selectPostByID = mm.select(...coreCols, t.content, ...userCols).byID();
}

export default mm.tableActions(t, PostTA);
