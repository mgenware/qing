import * as dd from 'mingru-models';
import user from './user';

export class Post extends dd.Table {
  id = dd.pk();
  title = dd.varChar(255);
  content = dd.text();
  user_id = user.id;

  created_at = dd.datetime(true);
  modified_at = dd.datetime(true);
  likes = dd.int();
  cmt_count = dd.uInt();
}

export default dd.table(Post);
