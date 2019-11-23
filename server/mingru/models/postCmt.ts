import * as mm from 'mingru-models';
import post from './post';
import cmt from './cmt';

export class PostCmt extends mm.Table {
  target_id = mm.pk(post.id);
  cmt_id = mm.pk(cmt.id);
}

export default mm.table(PostCmt);
