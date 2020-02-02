import * as mm from 'mingru-models';
import user from './user';

export class Cmt extends mm.Table {
  id = mm.pk();
  content = mm.text();
  user_id = user.id;

  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;
  rpl_count = mm.uInt(0);
}

export default mm.table(Cmt);
