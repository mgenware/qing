import * as mm from 'mingru-models';
import forumPost from './forumPost';
import user from './user';

export class ForumAnswer extends mm.Table {
  id = mm.pk();
  content = mm.text();
  user_id = user.id;
  post_id = forumPost.id;

  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;
  cmt_count = mm.uInt().default(0);

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);
}

export default mm.table(ForumAnswer);
