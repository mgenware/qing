import * as dd from 'mingru-models';
import t from './post';
import userTA from './userTA';
import user from './user';
import * as cm from './common';

const coreCols = [t.id, t.title, t.created_at, t.modified_at, t.cmt_count];
const jUser = t.user_id.join(user);
const userCols = [t.user_id, jUser.name, jUser.icon_name];

const updateConditions = dd.and(
  dd.sql`${t.id.isEqualToInput()}`,
  dd.sql`${t.user_id.isEqualToInput()}`,
);

export class PostTA extends dd.TA {
  selectPostsByUser = dd
    .selectPage(...coreCols)
    .by(t.user_id)
    .orderByDesc(t.created_at);

  selectPostForEditing = dd.select(t.title, t.content).where(updateConditions);

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
}

export default dd.ta(t, PostTA);
