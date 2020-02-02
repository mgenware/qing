import * as mm from 'mingru-models';
import user from './user';

export class Post extends mm.Table {
  id = mm.pk();
  title = mm.varChar(255);
  content = mm.text();
  user_id = user.id;

  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;
  cmt_count = mm.uInt(0);
  likes = mm.uInt(0);
}

export default mm.table(Post);
