import * as mm from 'mingru-models';
import user from './user';

export class Cmt extends mm.Table {
  // Common fields for both cmt and reply.
  id = mm.pk();
  content = mm.text();
  user_id = user.id;
  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;

  rpl_count = mm.uInt(0);
}

export const cmt = mm.table(Cmt);

export class Reply extends mm.Table {
  // Common fields for both cmt and reply.
  id = mm.pk();
  content = mm.text();
  user_id = user.id;
  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;

  to_user_id = user.id;
  parent_id = cmt.id;
}

export const reply = mm.table(Reply);
