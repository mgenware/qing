import * as mm from 'mingru-models';
import user from './user';

export class Cmt extends mm.Table {
  id = mm.pk();
  content = mm.text();
  user_id = user.id;

  created_at = mm.datetime(true);
  modified_at = mm.datetime(true);
  rpl_count = mm.uInt();
}

export default mm.table(Cmt);
