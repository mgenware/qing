import * as dd from 'mingru-models';
import user from './user';
import comment from './comment';

export class Reply extends dd.Table {
  id = dd.pk();
  title = dd.varChar(255);
  content = dd.text();
  user_id = user.id;

  to_user_id = user.id;
  parent_id = comment.id;
  created_at = dd.datetime(true);
  modified_at = dd.datetime(true);
}

export default dd.table(Reply);
