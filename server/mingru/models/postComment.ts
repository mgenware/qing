import * as dd from 'mingru-models';
import post from './post';
import comment from './comment';

export class PostComment extends dd.Table {
  post_id = dd.pk(post.id);
  cmt_id = dd.pk(comment.id);
}

export default dd.table(PostComment);
