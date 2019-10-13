import * as dd from 'mingru-models';
import t from '../models/post';
import userTA from './userTA';
import user from '../models/user';
import postCmt from '../models/postCmt';
import * as cm from '../models/common';
import cmt from '../models/cmt';

const coreCols = [t.id, t.title, t.created_at, t.modified_at, t.cmt_count];
const jUser = t.user_id.join(user);
const userCols = [t.user_id, jUser.name, jUser.icon_name];

const updateConditions = dd.and(
  dd.sql`${t.id.isEqualToInput()}`,
  dd.sql`${t.user_id.isEqualToInput()}`,
);

export class PostTA extends dd.TableActions {
  selectPostsByUser = dd
    .selectPage(...coreCols)
    .by(t.user_id)
    .orderByDesc(t.created_at);

  selectPostForEditing = dd.select(t.title, t.content).where(updateConditions);

  selectCmts: dd.SelectAction;

  insertPost = dd
    .transact(
      dd
        .insertOne()
        .setInputs(t.title, t.content, t.user_id)
        .setDefaults(),
      userTA.updatePostCount.wrap({ offset: 1 }),
    )
    .argStubs(cm.sanitizedStub, cm.captStub);

  editPost = dd
    .updateOne()
    .setInputs(t.title, t.content)
    .where(updateConditions);

  deletePost = dd.deleteOne().where(updateConditions);

  selectPostByID = dd.select(...coreCols, t.content, ...userCols).byID();

  constructor() {
    super();

    const jCmt = postCmt.cmt_id.join(cmt);
    this.selectCmts = dd
      .select(
        jCmt.content,
        jCmt.created_at,
        jCmt.modified_at,
        jCmt.rpl_count,
        jCmt.user_id,
        jCmt.user_id.join(user).name,
      )
      .from(postCmt)
      .by(postCmt.post_id);
  }
}

export default dd.ta(t, PostTA);
