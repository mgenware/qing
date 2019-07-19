import * as dd from 'dd-models';
import t from './post';

export class PostTA extends dd.TA {
  selectPostsByUser = dd
    .selectPage(t.id, t.title, t.content, t.created_at, t.modified_at)
    .by(t.user_id);

  insertPost = dd
    .insertOne()
    .setInputs(t.title, t.content, t.user_id)
    .setDefaults();
}

export default dd.ta(t, PostTA);
