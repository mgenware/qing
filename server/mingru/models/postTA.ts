import * as dd from 'dd-models';
import t from './post';
import userTA from './userTA';
import user from './user';

const coreCols = [t.id, t.title, t.created_at, t.modified_at, t.cmt_count];
const jUser = t.user_id.join(user);
const userCols = [t.user_id, jUser.name, jUser.icon_name];

export class PostTA extends dd.TA {
  selectPostsByUser = dd.selectPage(...coreCols).by(t.user_id);

  insertPost = dd.transact(
    dd
      .insertOne()
      .setInputs(t.title, t.content, t.user_id)
      .setDefaults(),
    userTA.updatePostCount.wrap({ offset: 1 }),
  );

  selectPostByID = dd.select(...coreCols, t.content, ...userCols).byID();
}

export default dd.ta(t, PostTA);
