import * as mm from 'mingru-models';
import user from './user';

export class Cmt extends mm.Table {
  // Common fields for both cmt and reply.
  id = mm.pk();
  content = mm.text();
  user_id = user.id;
  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;

  // `post_id` is only used to retrieve post ID in order to update cmt count when deleting a cmt.
  // It's not used to fetch post cmts and not a FK(not indexed).
  post_id = mm.uBigInt();

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
