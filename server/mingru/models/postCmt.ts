import * as mm from 'mingru-models';
import post from './post';
import { cmt } from './cmt';

export class PostCmt extends mm.Table {
  // In order to implement the same interface for all cmt-related tables,
  // we use a unified name `host_id`.
  host_id = mm.pk(post.id);
  cmt_id = mm.pk(cmt.id);
}

export default mm.table(PostCmt);
