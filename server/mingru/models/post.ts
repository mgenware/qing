import * as mm from 'mingru-models';
import user from './user';

export class Post extends mm.Table {
  id = mm.pk();
  title = mm.varChar(255);
  content = mm.text();
  user_id = user.id;

  created_at = mm.datetime(true);
  modified_at = mm.datetime(true);
  likes = mm.int();
  cmt_count = mm.uInt();
}

export default mm.table(Post);
