import * as mm from 'mingru-models';
import user from './user';
import cmt from './cmt';

export class Reply extends mm.Table {
  id = mm.pk();
  title = mm.varChar(255);
  content = mm.text();
  user_id = user.id;

  to_user_id = user.id;
  parent_id = cmt.id;
  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;
}

export default mm.table(Reply);
