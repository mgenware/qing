import * as mm from 'mingru-models';
import user from '../user';

export default class PostCore extends mm.Table {
  id = mm.pk();
  content = mm.text();
  user_id = user.id;

  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;

  cmt_count = mm.uInt().default(0);
}
