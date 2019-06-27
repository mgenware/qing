import * as dd from 'dd-models';
import t from './post';

export class PostTA extends dd.TA {
  postsByUser = dd
    .selectRows(t.id, t.title, t.content, t.created_at, t.modified_at)
    .paginate()
    .byID();

  insertPost = dd
    .insertOne()
    .setInputs(t.title, t.content, t.user_id)
    .setDefaults();
}

export default dd.ta(t, PostTA);
