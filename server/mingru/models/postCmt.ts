import * as dd from 'mingru-models';
import post from './post';
import cmt from './cmt';

export class PostCmt extends dd.Table {
  post_id = dd.pk(post.id);
  cmt_id = dd.pk(cmt.id);
}

export default dd.table(PostCmt);
