import * as mm from 'mingru-models';
import * as mr from 'mingru';
import t from '../models/post';
import userTA from './userTA';
import user from '../models/user';
import postCmt from '../models/postCmt';
import * as cm from '../models/common';
import * as cmtHelper from './cmtHelper';

const coreCols = [t.id, t.title, t.created_at, t.modified_at, t.cmt_count];
const jUser = t.user_id.join(user);
const userCols = [t.user_id, jUser.name, jUser.icon_name].map(c =>
  c.attr(mr.ColumnAttributes.jsonIgnore),
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

  selectPostForEditing = mm.select(t.title, t.content).where(updateConditions);

  selectCmts = cmtHelper.selectCmts(postCmt);
  insertCmt = cmtHelper.insertCmt(postCmt);

  insertPost = mm
    .transact(
      mm
        .insertOne()
        .setInputs(t.title, t.content, t.user_id)
        .setDefaults(),
      userTA.updatePostCount.wrap({ offset: 1 }),
    )
    .argStubs(cm.sanitizedStub, cm.captStub);

  editPost = mm
    .updateOne()
    .setInputs(t.title, t.content)
    .where(updateConditions);

  deletePost = mm.deleteOne().where(updateConditions);

  selectPostByID = mm.select(...coreCols, t.content, ...userCols).byID();
}

export default mm.tableActions(t, PostTA);
