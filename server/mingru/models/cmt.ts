import * as dd from 'mingru-models';
import user from './user';

export class Cmt extends dd.Table {
  id = dd.pk();
  content = dd.text();
  user_id = user.id;

  created_at = dd.datetime(true);
  modified_at = dd.datetime(true);
  rpl_count = dd.uInt();
}

export default dd.table(Cmt);
