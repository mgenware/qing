import * as dd from 'dd-models';
import t from './post';
import userTA from './userTA';

const coreCols = [t.id, t.title, t.created_at, t.modified_at, t.cmt_count];

export class PostTA extends dd.TA {
  selectPostsByUser = dd.selectPage(...coreCols).by(t.user_id);

  insertPost = dd.transact(
    dd
      .insertOne()
      .setInputs(t.title, t.content, t.user_id)
      .setDefaults(),
    userTA.updatePostCount.wrap({ offset: 1 }),
  );

  selectPostByID = dd.select(...coreCols, t.content, t.user_id).byID();
}

export default dd.ta(t, PostTA);
