import * as mm from 'mingru-models';
import { cmt } from '../cmt';
import PostCore from './postCore';

export default abstract class PostCmtCore extends mm.Table {
  // Comment ID.
  cmt_id = mm.pk(cmt.id);

  // Post ID.
  // In order to implement the same interface for all cmt-related tables,
  // we use a more generic name `host_id`.
  host_id: mm.Column;

  constructor() {
    super();
    this.host_id = mm.pk(this.getPostTable().id);
  }

  abstract getPostTable(): PostCore;
}
