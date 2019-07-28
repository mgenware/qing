import * as dd from 'dd-models';
import t from './post';
import userTA from './userTA';

export class PostTA extends dd.TA {
  selectPostsByUser = dd
    .selectPage(t.id, t.title, t.content, t.created_at, t.modified_at)
    .by(t.user_id);

  insertPost = dd.transact(
    dd
      .insertOne()
      .setInputs(t.title, t.content, t.user_id)
      .setDefaults(),
    userTA.updatePostCount.wrap({ offset: 1 }),
  );
}

export default dd.ta(t, PostTA);
